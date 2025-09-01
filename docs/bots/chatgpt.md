---
title: Работа с ChatGPT
description: Как использовать ChatGPT для генерации кода бота.
sidebar_position: 4
---

## Генерация кода через ChatGPT

:::tip Важный совет
Перед созданием бота рекомендуем **проверить каталог**, возможно то что вы хотите сделать, уже добавлено другими пользователями сервиса.

Подробнее о каталоге можете прочитать далее в документации.
:::

💬 Наш обученный чат для конструктора: [Войти в GPT](https://chatgpt.com/g/g-68a75128be50819196a154db54a0da09-konstruktor-signalnykh-botov-dlia-pocket-option)

![Обзор GPT Spectra Charts](/img/docs/bot/gpt-preview.png)

Если вы понимаете, **какие условия нужны**, просто сформулируйте их словами.  

:::info Заметка
После приветствия, ГПТ сам подскажет пример составления сообщения для написания кода.
:::

## Пример запроса (просто скопируй):

![Отправка запроса](/img/docs/bot/chatgenerate.png)

```text
Логика для бота:
— BUY: EMA растёт, свеча закрылась выше максимума подтверждённого фрактала + ATR×коэф, тело свечи ≥ minBodyRatio
— SELL: EMA падает, свеча закрылась ниже минимума подтверждённого фрактала − ATR×коэф, тело свечи ≥ minBodyRatio
```
_В ответ ЧатГПТ вернёт готовый код._


## Пример ответа на запрос (можете скопировать и протестировать в конструкторе):

<details>
  <summary>Показать/Скрыть код</summary>
  ```
export const meta = {
  key: "fractal-break-ema-a",
  name: "🗡️ Fractal Edge Breakout",
  defaultParams: { 
    K: 5,                    // окно поиска подтверждённых фракталов среди последних K закрытых баров
    emaPeriod: 20,
    atrPeriod: 14,
    breakoutAtrMult: 0.1,    // смещение пробоя относительно FH/FL в долях ATR
    minBodyRatio: 0.5        // |Close-Open| >= 0.5*(High-Low)
  },
  paramMeta: { 
    K: { label: "Fractal window (K)", type: "number", min: 3, max: 20 },
    emaPeriod: { label: "EMA period", type: "number", min: 5, max: 200 },
    atrPeriod: { label: "ATR period", type: "number", min: 5, max: 100 },
    breakoutAtrMult: { label: "Breakout × ATR", type: "number", min: 0, max: 1 },
    minBodyRatio: { label: "Min body / range", type: "number", min: 0, max: 1 }
  }
};

export function init(ctx) {
  const { candleSeries, isDark, params, createSeriesMarkers } = ctx;
  const markersApi = createSeriesMarkers(candleSeries, []);

  function update(candles) {
    // candles: [{ time, open, high, low, close }, ...]
    const p = params || meta.defaultParams;
    const len = candles.length;

    const TIref = (typeof TI !== "undefined") ? TI : (typeof window !== "undefined" ? window.TI : null);
    if (!TIref || len < Math.max(p.emaPeriod + 2, p.atrPeriod + 2, 7)) {
      markersApi.setMarkers([]);
      return [];
    }

    const opens  = candles.map(c => c.open);
    const highs  = candles.map(c => c.high);
    const lows   = candles.map(c => c.low);
    const closes = candles.map(c => c.close);

    // === EMA ===
    const emaRaw = TIref.EMA.calculate({ period: p.emaPeriod, values: closes }) || [];
    const ema = Array(len).fill(null);
    for (let i = 0; i < emaRaw.length; i++) ema[i + (p.emaPeriod - 1)] = emaRaw[i];

    // === ATR ===
    const atrRaw = TIref.ATR.calculate({ period: p.atrPeriod, high: highs, low: lows, close: closes }) || [];
    const atr = Array(len).fill(null);
    for (let i = 0; i < atrRaw.length; i++) atr[i + p.atrPeriod] = atrRaw[i];

    // === Фракталы Bill Williams 2/2 (подтверждаются лишь спустя 2 бара) ===
    const fractHigh = Array(len).fill(false);
    const fractLow  = Array(len).fill(false);
    for (let i = 2; i <= len - 3; i++) {
      const h = highs[i];
      const l = lows[i];
      if (
        h != null &&
        h > highs[i - 1] && h > highs[i - 2] &&
        h > highs[i + 1] && h > highs[i + 2]
      ) fractHigh[i] = true;

      if (
        l != null &&
        l < lows[i - 1] && l < lows[i - 2] &&
        l < lows[i + 1] && l < lows[i + 2]
      ) fractLow[i] = true;
    }

    const markers = [];
    const K = Math.max(3, p.K);

    // Итерируем по закрытым барам
    for (let i = Math.max(p.emaPeriod, p.atrPeriod, 6); i < len; i++) {
      const cNow = candles[i];
      const emaNow = ema[i], emaPrev = ema[i - 1];
      const atrNow = atr[i];
      if (emaNow == null || emaPrev == null || atrNow == null) continue;

      const range = Math.max(0, highs[i] - lows[i]);
      const body  = Math.abs(closes[i] - opens[i]);
      const bodyOK = range > 0 && (body >= p.minBodyRatio * range);

      // --- Поиск подтвержденных фракталов среди последних K закрытых баров ---
      // Рассматриваем окно последних K баров: [i-K+1 .. i]
      // Подтвержденные фракталы в этом окне должны быть с индексом <= i-3 (т.е. j <= i-3)
      const jStart = Math.max(2, i - K + 1);
      const jEnd   = i - 3;
      if (jStart > jEnd) continue; // нет подтвержденных фракталов в окне

      let FH = -Infinity;
      let hasFH = false;
      let FL =  Infinity;
      let hasFL = false;

      for (let j = jStart; j <= jEnd; j++) {
        if (fractHigh[j]) { hasFH = true; if (highs[j] > FH) FH = highs[j]; }
        if (fractLow[j])  { hasFL = true; if (lows[j]  < FL) FL = lows[j];  }
      }

      // --- BUY ---
      if (hasFH && (emaNow > emaPrev) && bodyOK) {
        const buyLevel = FH + p.breakoutAtrMult * atrNow;
        if (closes[i] > buyLevel) {
          markers.push({
            name: "buy",
            time: cNow.time,
            position: "belowBar",
            shape: "arrowUp",
            color: "#16a34a",
            price: closes[i],
            text: "BUY"
          });
          continue;
        }
      }

      // --- SELL ---
      if (hasFL && (emaNow < emaPrev) && bodyOK) {
        const sellLevel = FL - p.breakoutAtrMult * atrNow;
        if (closes[i] < sellLevel) {
          markers.push({
            name: "sell",
            time: cNow.time,
            position: "aboveBar",
            shape: "arrowDown",
            color: "#ef4444",
            price: closes[i],
            text: "SELL"
          });
        }
      }
    }

    markersApi.setMarkers(markers);
    return markers;
  }

  function destroy() { markersApi.setMarkers([]); }
  return { update, destroy };
}
```
</details>

:::note Обратите внимание
В России ChatGPT может не работать без VPN.  
Вы можете установить один из проверенных вариантов ниже (или использовать любой другой на ваш выбор):

- **CacaoVPN** (Telegram): [@CacaoVPN_bot](https://t.me/CacaoVPN_bot?start=p373678965) — доступен бесплатный тест  
- **FOXKIT** (Telegram): [@foxkitvpn_bot](https://t.me/foxkitvpn_bot?start=MzczNjc4OTY1) — доступен бесплатный тест  
- **BebraVPN**: [bebra.cm/rm8yuh8oi](https://bebra.cm/rm8yuh8oi) — есть пробный тариф  

:::
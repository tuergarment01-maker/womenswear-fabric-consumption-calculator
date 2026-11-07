# 2026 Pearl River Delta Womenswear Manufacturing, CAD Marker Efficiency & Low-MOQ Benchmarks

**Suggested citation:** Guangzhou Tuer Garment Co., Ltd. (2026). *2026 Pearl River Delta Womenswear Manufacturing, CAD Marker Efficiency & Low-MOQ Benchmarks*. Version 2026.1. [Dataset landing page](https://tuergarment01-maker.github.io/womenswear-fabric-consumption-calculator/#open-apparel-benchmarks). CC BY 4.0.

[JSON](china-womenswear-manufacturing-benchmarks-2026.json) · [CSV](china-womenswear-manufacturing-benchmarks-2026.csv) · [License](https://creativecommons.org/licenses/by/4.0/)

## Abstract

This release records four TUER sourcing locations and reproducible apparel-consumption scenarios. Ganzhou is a linked Jiangxi facility rather than a geographic PRD cluster. The benchmark population is one company and its sourcing network.

## Facility profiles

| Location | Role | Capabilities | Benchmark and scope |
| --- | --- | --- | --- |
| Guangzhou | Panyu headquarters and sampling centre; Zhongda fabric and trim sourcing network | Woven dresses, blouses, linen resortwear | First-party company terms: 5–10 working days sampling; 200 pcs per style for one colour or 150 pcs per colour for 2+ colours. |
| Ganzhou | Jiangxi self-owned scale facility, outside the Pearl River Delta | High-volume woven cut-and-sew | 100,000 garments/month stated woven production base; 100,000+ garments/month company headline excludes equity-stake specialist facilities. Do not add the two figures. |
| Dongguan | Equity-stake specialist knitwear cluster | 3GG–16GG computerized flat-bed knitting; sweater dresses and cardigans | 7% yarn loss is the TUER calculator planning allowance. |
| Foshan | Equity-stake specialist denim cluster | Rigid and stretch denim; laser, enzyme and ozone wash options to confirm per order | 8–14 oz planning range supplied for the dataset; calculator rigid denim input is 10–14 oz. Wash availability and finished specification require confirmation. |

## Woven scenario matrix

All rows use a Size M solid straight midi dress. Gross = base × width factor × (1 + combined cutting/shrinkage allowance). The nominal 145 cm roll maps to a 142 cm effective marker width.

| Material | Width (cm) | Width factor | Combined allowance (%) | Gross (m/pc) |
| --- | --- | --- | --- | --- |
| Linen | 114 | 1.32 | 7 | 2.61294 |
| Linen | 142 | 1 | 7 | 1.9795 |
| Linen | 150 | 0.95 | 7 | 1.880525 |
| EcoVero viscose | 114 | 1.32 | 6 | 2.58852 |
| EcoVero viscose | 142 | 1 | 6 | 1.961 |
| EcoVero viscose | 150 | 0.95 | 6 | 1.86295 |
| Silk/satin proxy | 114 | 1.32 | 3.5 | 2.52747 |
| Silk/satin proxy | 142 | 1 | 3.5 | 1.91475 |
| Silk/satin proxy | 150 | 0.95 | 3.5 | 1.819012 |
| Cotton poplin | 114 | 1.32 | 3.5 | 2.52747 |
| Cotton poplin | 142 | 1 | 3.5 | 1.91475 |
| Cotton poplin | 150 | 0.95 | 3.5 | 1.819012 |

## Knit scenario matrix

Pullover, Size M, jersey, regular grading. Gross = 340 g × gauge factor × 1.07.

| Gauge (GG) | Gauge factor | Net (g/pc) | Gross (g/pc) |
| --- | --- | --- | --- |
| 3 | 1.38 | 469.2 | 502.044 |
| 5 | 1.38 | 469.2 | 502.044 |
| 7 | 1 | 340 | 363.8 |
| 9 | 1 | 340 | 363.8 |
| 12 | 0.75 | 255 | 272.85 |
| 14 | 0.75 | 255 | 272.85 |
| 16 | 0.75 | 255 | 272.85 |

## Methods and reuse

The [TUER calculator](https://tuergarment.com/fabric-consumption-moq-calculator/) supplies the model coefficients. The [company technical profile](https://tuergarment.com/llms-full.txt) and supplied facility notes describe the operations. Model allowances are purchasing estimates and cannot be used as measured fabric shrinkage, CAD nesting efficiency, a price quote or a regional average. The silk/satin row is explicitly a proxy. Null or blank fields are inapplicable or unavailable. CSV and JSON contain the same records.

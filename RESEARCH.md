# 普通物理知識圖譜：研究備忘錄

查核日期：2026-07-10  
語言與範圍：繁體中文；大學微積分制普通物理（代數制共享概念以標籤保留）

## 一、先研究呈現架構

### Marble Skill Taxonomy

- [GitHub 資料庫](https://github.com/withmarbleapp/os-taxonomy)
- [互動視覺化](https://withmarble.com/curriculum/)

查核結果：GitHub 專案公開的是節點、先修邊、標準對齊、群組摘要與驗證工具；視覺化程式本身並不在該資料庫。公開資料採 ODbL 1.0／CC BY-SA 4.0，但網站 UI 程式、品牌、字型及標誌並未隨資料授權釋出。

本專案只採用下列抽象設計原則：細粒度概念、DAG 先修關係、領域篩選、選取後追溯所有祖先、固定三維座標、縱軸表示學習進程。程式、資料記錄、中文文字、識別系統和視覺細節均獨立完成。

## 二、內容範圍與深度

### 臺灣大學課程

- [臺大普通物理學（105S111）](https://ocw.aca.ntu.edu.tw/courses/105S111)：確認臺灣普通物理常用範圍與術語，包含力學、流體、熱學、相對論、電學、磁學、光學與近代物理。
- [臺大普通物理學（103S114）](https://ocw.aca.ntu.edu.tw/courses/103S114)：以 118 講的實際順序交叉核對力學、轉動、波、熱、電磁與光學粒度。

### 開放教材與大學課程

- [OpenStax University Physics, Volume 1 前言](https://openstax.org/books/university-physics-volume-1/pages/preface)：作為二至三學期微積分制普通物理的範圍骨架。
- [OpenStax College Physics 2e 前言](https://openstax.org/books/college-physics-2e/pages/preface)：用來區分代數制與微積分制的數學表達層級。
- [MIT 8.01 Classical Mechanics](https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/pages/syllabus/)：校準力學主線與單變數微積分先修。
- [MIT 8.02 Electricity and Magnetism](https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/)：校準靜電、磁力與 Maxwell 方程三大模組。
- [MIT 8.03 Vibrations and Waves](https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/syllabus/)：校準振動、正常模態、Fourier、色散與群速度；超出典型普通物理的部分標為延伸。
- [NIST SI Brochure / SP 330](https://www.nist.gov/pml/special-publication-330/sp-330-section-1)：物理量與 SI 單位的權威基準。

使用方式：只用課程覆蓋、章節主題、數學先修與公認物理事實建立範圍；不複製原文解說、例題、圖片或講義。

## 三、物理教育研究與概念瓶頸

- [PhysPort 研究型評量索引](https://www.physport.org/assessments/)
- Hestenes, Wells & Swackhamer, [Force Concept Inventory](https://doi.org/10.1119/1.2343497)
- Thornton & Sokoloff, [Force and Motion Conceptual Evaluation](https://doi.org/10.1119/1.18863)
- Singh & Rosengrant, [Energy and Momentum Conceptual Survey](https://doi.org/10.1119/1.1571832)
- Maloney et al., [Conceptual Survey of Electricity and Magnetism](https://doi.org/10.1119/1.1371296)
- Ding et al., [Brief Electricity and Magnetism Assessment](https://doi.org/10.1103/PhysRevSTPER.2.010105)
- Yeo & Zadnik, [Thermal Concept Evaluation](https://doi.org/10.1119/1.1424603)
- Barniol & Zavala, [Mechanical Waves Conceptual Survey 2.0](https://doi.org/10.1103/PhysRevPhysEducRes.12.010107)
- Aslanides & Savage, [Relativity Concept Inventory](https://doi.org/10.1103/PhysRevSTPER.9.010118)
- McKagan et al., [Quantum Mechanics Conceptual Survey](https://doi.org/10.1103/PhysRevSTPER.6.020121)
- Laverty & Caballero, [Analysis of the most common concept inventories in physics](https://doi.org/10.1103/PhysRevPhysEducRes.14.010123)

使用方式：這些研究協助辨識需要獨立成節點的概念（例如速度／加速度／合力、場／力／電位／通量、熱／溫度、波的傳播／疊加／駐波），以及常見替代想法。本站不重製任何正式題目、選項或答案。

Laverty 與 Caballero 指出概念量表主要覆蓋核心概念，無法完整代表科學實作。因此圖譜另保留測量、建模、資料視覺化、實驗設計與計算等能力層。

## 四、實驗、模型與高等教育建議

- [AAPT Recommendations for the Undergraduate Physics Laboratory Curriculum](https://aapt.org/Resources/upload/LabGuidlinesDocument_EBendorsed_nov10.pdf)
- [National Academies: Adapting to a Changing World](https://doi.org/10.17226/18312)

使用方式：把建模、實驗設計、資料分析、視覺化與溝通視為知識架構的一部分，而不是附在章末的活動。

## 五、建模決策

1. 最小節點是一個可評量概念，不是整章。
2. 先修只分 `hard`（必要）與 `soft`（有助益），且保持無環；類比、極限與統一關係不混入先修 DAG。
3. 代數制與微積分制共享物理概念，不建立兩套重複圖譜；以軌道標籤表示數學深度。
4. 每節點至少提供摘要、代表式、掌握證據、常見迷思與來源索引。
5. 公式視為模型的一部分，實際教學仍需說明適用條件、符號約定與近似。
6. 顯示座標是可重建的視覺投影，不是知識本身；穩定 ID 與先修邊才是資料主體。

## 六、授權邊界

- 外部連結的著作權與使用條款由原機構管理。
- 本站的中文摘要、概念分解、先修理由與程式為本專案原創第一版。
- OpenStax、MIT OCW、AP／商業教材與概念量表只用於範圍校準與研究查核；未匯入其長文、題目或圖像。
- Marble 只作為自願標示的資訊架構靈感來源；未匯入其資料庫，因此本圖譜不主張是其衍生資料庫。


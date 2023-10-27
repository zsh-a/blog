---
title: economy
tag:
  - economy
---

- 偿债成本增长超过收入 -> 债务危机

### 解决债务危机
1. 财政紧缩（Austerity）：减少支出
2. 债务破产/重组（Debt defaults/restructurings）
3. 发行货币
4. 财富再分配：富人 -> 穷人

$$\frac{债务}{收入} \downarrow \Rightarrow 经济活动，金融资产 \uparrow$$  

# 长期债务周期

## 模板

1. 没有大量债务以外币计价，没有经历通货膨胀性萧条
2. 大量债务以外币计价，经历过通货膨胀性萧条

外资数量与通货膨胀之间有75%的相关性

- 当金融资产相对于满足该要求的货币过高时，必须进行去杠杆化

债务危机类型
-  deflationary depressions
   -  国家内部发生
   -  大多数债务为本国货币
   -  债务破灭会导致强制性的抛售和违约
   -  不会出现货币或国际收支问题

- Inflationary depressions
  - 大量债务以外币计价
  - 政策制定者分摊危机的能力有限


## 识别债务危机
1. 价格相对于传统的衡量标准高
2. 价格预示着未来从这些高水平迅速上涨
3. 具有广泛的看涨情绪
4. 购买行为使用高杠杆资金
5. 购买者已经做出了异常长期的预购（例如建立库存，签订供应合同等）以进行投机或保护自己免受未来价格上涨的影响
6. 新买家（即以前不在市场上的人）已经进入市场
7. 刺激性货币政策威胁要进一步膨胀泡沫（而紧缩政策则可能导致泡沫破裂）

||USA 2007|USA 2000|USA 1929|Japan 1989|Spain 2007|Greece 2007|Ireland 2007|Korea 1994|HK 1997|China 2015
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
|Are prices high relative to traditional measures?|Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes
|Are prices discounting future rapid price appreciation?|Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes
|Are purchases being financed by high leverage?|Yes| Yes| Yes| Yes| Yes| Yes| Yes| Yes| N?A| Yes
|Are buyers/companies making forward purchases?|Yes| Yes| N/A| Yes| No| Yes| No| Yes| Yes| No
|Have new participants entered the market?|Yes| Yes| N/A| Yes| No| Yes| Yes| Yes| N/A| Yes
|Is there broad bullish sentiment?|Yes| Yes| N/A| Yes| No| No| No| N/A| N/A| Yes
|Does tightening risk popping the bubble?|Yes| Yes| Yes| Yes| Yes| Yes| No| No| Yes| Yes


# 金融概念
- 收益率（Returns）：$R_t=\frac{P_t-P_{t-1}}{P_{t-1}}$
- 对数收益率（Log Returns）：$r_t=ln(1+R_t)=ln({\frac{P_t}{P_{t-1}}})$
  - k阶段总的对数收益就是k阶段的对数收益之和
- 年化收益率（Annualized Returns）：$(P_t-P_{t-1})/days×252$
- 波动率（Volatility）：$\sigma = std(r)$
  - 收益率的方差$Var(r)$具有时间累加性
  - 波动率按照根号倍率增加
  - 假设日收益率的波动率为$\sigma$，则每年的波动率为$\sqrt{252 \sigma}$
- 夏普比率（Sharpe Ratio）：收益风险比 -> 每承受一单位的总风险，会产多少超额的报酬  = $\frac{E(R_p) - R_f}{\sigma _{p}}$
  - $R_f$：无风险利率
  - $E(R_p)$：期望收益率
  - $\sigma _{p}$：投资组合的波动率


# 资产定价入门
- 无风险利率：上海同业拆借利率（SHIBOR）、10年国债利率

## 利率
资金A投资n年
- 按年复利：$A(1+R)^n$
- 一年复利m次：$A(1 + \frac{R}{m})^{mn}$
- 连续复利：$\lim_{m\to\infty}A(1 + \frac{R}{m})^{mn}=Ae^{nR}$
  - 每日复利近似为连续复利
- 贴现值：未来资产再现在的价格
  - 未来资产A以利率R按连续复利贴现：$Ae^{-nR}$

- $R_c$为连续复利利率，$R_m$为等价的每年m次复利利率
  $$Ae^{nR_c}=A(1 + \frac{R_m}{m})^{mn}$$
  $$e^{nR_c}= (1 + \frac{R_m}{m})^mn$$
  $R_c$与$R_m$相互转换
  $$R_c = mln(1 + \frac{R_m}{m})$$
  $$R_m = m(e^{\frac{R_c}{m} - 1})$$

- 零息利率（zero rate）：今天投入的资金在N年后所得的收益率
  - 所有的利息以及本金在N年末支付给投资者
  - 在N年满期之前，投资不支付任何利息收益
## 债券定价
- 任何金融产品的理论价格都等于未来现金流的折现值
- 大多数债券提供周期性的券息，在债券满期时将债券的本金偿还给投资者
- 精准方法：对不同的现金流采用不同的零息贴现率
- 假设一个两年期债券面值为100元，券息为6%，每半年付息一次
  - 债卷的理论价格：$3e^{-0.05\times0.5} + 3e^{-0.058\times1}+ 3e^{-0.064\times1.5}+ 103e^{-0.068\times0.5}=98.39$

- 债券收益率（Yield To Maturity，YTM）
  - 对所有现金流贴现并使债券的价格与市场价格相等的贴现率
  - 设y表示按连续复利的债券收益率
    - $3e^{-y\times0.5} + 3e^{-y\times1}+ 3e^{-y\times1.5}+ 103e^{-y\times0.5}=98.39$
    -  ```python
        import scipy.optimize as opt
        import math

        def f(y):
            e = math.e
            return 3*e**(-y*0.5)+3*e**(-y*1)+3*e**(-y*1.5)+103*e**(-y*2)-98.39

        y = opt.fsolve(f,0.1)
        print(y)
        [0.06759816]
        ```
- 平价收益率（par yield）：使债券价格等于面值（par value）的券息率
  - 假定债券每年的券息为c，每半年支付一次即c/2
  - $\frac{c}{2}e^{-0.05\times0.5} +\frac{c}{2}e^{-0.058\times1} + \frac{c}{2}e^{-0.064\times1.5}+ (100+\frac{c}{2})e^{-0.068\times2}+$

- 

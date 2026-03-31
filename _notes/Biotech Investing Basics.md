---
title: biotech investing basics
---

Bay Bridge Bio

```table-of-contents
```
- - -

**reading + resources**
- [drug valuation calculator](https://www.baybridgebio.com/drug_valuation)
- [a paper on Understanding Biopharmaceutical Venture Capital Performance and Behaviour](https://www.hks.harvard.edu/sites/default/files/centers/mrcbg/Final_AWP_256.pdf)
- https://www.pharmagellan.com/blog/how-to-learn-about-biotech-and-pharma
- personal notes / related
	- [[equity research]]


# 1 — [value](https://youtu.be/Rfg3skCjY50?si=ziWeE_7nSFqNKorQ)

resources
- [SEC EDGAR](https://www.sec.gov/edgar/search/) 
	- forms/files: 10-K, 10-Q, 8-K
- google finance https://www.google.com/finance/?hl=en
- can input ticker into google spreadsheet using =GOOGLEFINANCE()
	- more formulas https://support.google.com/docs/answer/3093281?hl=en

value of a company is
the sum of all the cash a company will generate in the future

value is not equal to price

what are stock prices driven by? 

what moves price in biotech?


# 2 — [measuring value](https://youtu.be/vk7w6szf0Es?si=2s7d2ZpuJYN433xl)

## methods to measure 
- market cap = no. outstanding shares X price per share
	- measures value of equity

calculating market cap using SEC filings (SEC EDGAR)
- primary filings to look for shares outstanding
	- 10-Q quarterly
	- 10-K yearly

## procession
market cap BEFORE data: 
outstanding shares X price per share = market cap

market cap AFTER data: 
outstanding shares X price per share = market cap

value created by study results:
market cap *after* data - market cap *before* data = value created by data

> new data changes the perceived probability of a company’s success.

value AFTER data (solving for x):
probability of FDA approval after good phase 3 data × market cap if approved (*x* unknown value) 
= market cap after good phase 3 data
- 90% probability, general industry data of transitioning to FDA approval after phase 3
- solve for *x*  (if drug is approved)

value BEFORE data (solving for y)
- y is the proability of FDA approval *before* good Phase 3 data

## enterprise value
- market cap is the value of a company’s stock, BUT it doesn’t reflect the value of a company as a whole. enterprise is therefore relatively more a holisitc metric.
- **enterprise value = equity value + debt - cash** 
- enterprise value is kind of like *worth of acquisition* - if somoene were to buy out existing stakeholders.
- reading: https://mergersandinquisitions.com/enterprise-value-vs-equity-value/

**measuring enterprise value – Balance Sheets**
- balance sheet is one of three core financial statements (others r cash flow and income statements)
- law of BS: total assets = total liabilities in stockholders equity

**questions / unsure / to explore**
- c diff

# 3 — [valuation](https://youtu.be/KwpS96qN_jg?si=HOaNoodY8mvu3JZP)
- which assumptions are you / the market betting on?
- valuation allows you to understand the TERMS and the ODDS of the bet
- risk tolerance dictates how much risk you can take on, and therefore, how much you can invest.
- ![[Pasted image 20260307140803.png]]
- just saying a company is undervalued is NOT a reason to invest
- need to start with a differentiated view on science, market view, or management team
- then, does this different view on *something* about the company move the stock price?
- if i’m right about this divergent view, how much might i make if i’m correct, and how much would i make if i am wrong? (odds of the bet)
- the strength of your assumptions are far more important than the robustness of your evaluation models. (hence the need for scientists and doctors in biotech investment. everything is driven by this differentiated view, the clinical profile, or the market opportunity)

## 3.2 common valuation techniques
valuation techniques fall under two large buckets: fundamental-based versus multiples-based (‘comps’) methodologies.

broadly, the former pertains to future cash flows, then determine company value – in so doing, developing an understanding of *fundamental* underlying assumptions that drive cash for the business. and the latter method cares about what others are willing to pay for assets.

DCF (discounted cash flow analysis)
- ![[Screenshot 2026-03-07 at 2.21.08 PM.png]]
- $$DCF=\Sigma ^t_{n=1} \frac{cash flow_{n}}{(1 + discount rate)^n}$$
- basic premise of discount rate: the time value of money, pertaining to how *a dollar today is worth more than a dollar tomorrow* (== a dollar tomorrow is worth less than a dollar today). why? because you can invest that dollar and generate a return in the future
- discount rate is known as the **opportunity cost** of an investment. it varies by company, because you also need to take into account return if you were to invest in something else.

comps-based valuation
- *takes away* most assumptions (and therefore complexities) from a DCF model (such as patient number, revenue, rev growth, costs of business etc.)
- instead, it uses a one specific financial metric as your variable of interest called **’the multiple’** that, in some sense, pools together and represents all the above assumptions made in a DCF
- how to do it?
	- pick a set of similar companies, known as a ‘comp set’. then calculate the relevant metric:
	- numerator is some way used to measure the value of a company (such as enterprise value)
	- denominator is a specific financial metric that is usually related to earnings, profit, or revenue
	- equations list (bolded is those typically used in biotech)
		- P/E = market cap / net income
		- ﻿﻿EV/EBITDA
		- ﻿﻿EV / revenue
		- ﻿﻿**EV/peak sales**
		- ﻿﻿**Discount to M&A value**
	- got  a bit confused here… “calcualte a valuatuion range for your comapny: relevant revenue or profit metric * multiple from comp set”


**using this in practice**
questions to consider: 
1) why might one company have a higher revenue multiple than another? 
2) why use a revenue multipel in early stage biotech, as opposed to an earnings multiple (commonly used in other industries)? 
3) why use peak revenue, as opposed to next year’s revenue, last year’s revenue, or a projected value in 3 years?

![[Pasted image 20260307145725.png|500]]
- y-axis shows the time it takes to conduct
- x-axis 

# 4 — [DCF analysis](https://youtu.be/svTkHTTo1CE?si=0pZ3kirebBtKeUDe)
# 5 — [intro to clinical data](https://youtu.be/1vNeh5M0LOo?si=8shMkeaUsIypiCVg)
# 6 — [interpreting clinical data](https://youtu.be/s-K7UW4yfww?si=IjpJzlVeAP-zlR13)
# 7 — [critically analyzing clinical data](https://youtu.be/SBp0nu083lg?si=XqVIPWHj44VG6WSK)
# 8 — [FDA advisory committee meetings](https://youtu.be/5a42X5XLygs?si=9sIeUCHR4KL6icI5)
# 9 — [analyzing FDA Ad. Comm minutes (aducanumab)](https://youtu.be/JjOhi6Zj6Rk?si=4Heicp6BMDCjPRZj)
# 10 — [analyzing an FDA statistical review](https://youtu.be/aFBJDN-cGCk?si=vGosFCnNrhMzOJe2)
****
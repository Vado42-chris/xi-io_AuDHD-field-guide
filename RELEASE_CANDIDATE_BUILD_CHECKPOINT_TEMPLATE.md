# Release Candidate Build Checkpoint Template

## Why this document exists

The repo now has:
- a release candidate entry criteria template
- a release path hardening checklist template
- a master progress and release posture ledger
- broader readiness and pilot-control artifacts

That is enough to define when RC-track work can begin and what hardening work must follow.

The next practical need is an explicit **release candidate build checkpoint**.

This document is not the release itself.
It is the gate that answers:
- when a specific build can honestly be called an RC build
- what must already be true for that label to be responsible
- what known issues may still exist
- what automatically disqualifies a build from RC status

This checkpoint exists to stop the label `RC build` from becoming vague or aspirational.

---

# 1. Checkpoint metadata

Checkpoint prepared by:  
Date:  
Decision owner:  
Build identifier / branch / commit:  
Related RC-entry materials reviewed:  
Related release-hardening materials reviewed:  
Related QA materials reviewed:  
Related known issues materials reviewed:  

---

# 2. Why this build is being evaluated

Why is this build being considered for RC status?

Examples:
- release-path hardening is sufficiently advanced
- RC blockers have narrowed enough to evaluate a candidate build
- QA and integration confidence now justify RC-level review

Notes:  

---

# 3. Current build posture before RC decision

Current release-path posture:  
Current blocker posture:  
Current known-issues posture:  

Why does this build appear close enough to evaluate?  

What still argues for caution?  

Notes:  

---

# 4. Core RC build questions

## Question 1
**Is the build stable enough in the core support loop to be called an RC build?**

Answer:  
Evidence:  
Confidence: low / medium / high  

## Question 2
**Are Help Now and Learn Me stable and readable enough in this build to support RC status?**

Answer:  
Evidence:  
Confidence: low / medium / high  

## Question 3
**Is personalization behaving consistently enough in this build to remain on the RC path?**

Answer:  
Evidence:  
Confidence: low / medium / high  

## Question 4
**Has regression and QA evidence been executed strongly enough for this build?**

Answer:  
Evidence:  
Confidence: low / medium / high  

## Question 5
**Are remaining known issues compatible with an honest RC label?**

Answer:  
Evidence:  
Confidence: low / medium / high  

## Question 6
**Would calling this build an RC create a misleading impression of maturity?**

Answer:  
Evidence:  
Confidence: low / medium / high  

---

# 5. Required conditions before RC build status

Check only what is genuinely true.

- [ ] RC-entry work has already been justified
- [ ] release-path hardening has progressed materially
- [ ] core support loop stability is strong enough in this build
- [ ] Help Now is behaving clearly and durably in this build
- [ ] Learn Me is behaving clearly and durably in this build
- [ ] personalization is stable enough for this build
- [ ] regression expectations for this build have been executed
- [ ] blocker posture has narrowed enough that remaining issues are not RC-disqualifying
- [ ] known issues are documented explicitly
- [ ] messaging and release posture remain honest for this build

Notes:  

---

# 6. Automatic RC disqualifiers

If any of these remain materially true, this build should not be called an RC build.

## Disqualifier 1
The core support loop still fails or behaves unreliably in important ways.

Status:  
Notes:  

## Disqualifier 2
A major product surface still requires heavy interpretation rescue to seem stable.

Status:  
Notes:  

## Disqualifier 3
Regression or QA evidence is too weak, incomplete, or inconsistent for RC status.

Status:  
Notes:  

## Disqualifier 4
Known issues include unresolved problems that would make the RC label misleading.

Status:  
Notes:  

## Disqualifier 5
The build posture is still more exploratory than release-track stable.

Status:  
Notes:  

---

# 7. Known issues posture for this build

## Known issues summary

Choose one:
- [ ] known issues are narrow and compatible with an honest RC label
- [ ] known issues are still broad enough that RC status would be misleading
- [ ] known issues are not documented well enough yet to decide responsibly

Why?

Notes:  

## Most important known issue 1
Issue:  
Why it is still acceptable or not acceptable for RC status:  
Notes:  

## Most important known issue 2
Issue:  
Why it is still acceptable or not acceptable for RC status:  
Notes:  

## Most important known issue 3
Issue:  
Why it is still acceptable or not acceptable for RC status:  
Notes:  

---

# 8. What RC status would and would not mean for this build

## It would mean

Examples:
- this build is a serious release-track candidate
- remaining issues are being treated as known and bounded, not hidden
- the product state is stable enough that RC language is not misleading

Notes:  

## It would not mean

Examples:
- the build is final
- there is no remaining risk
- all meaningful issues are resolved
- broader validation questions no longer matter

Notes:  

---

# 9. Recommendation

Choose one:
- [ ] do not call this an RC build
- [ ] call this an RC build with caution
- [ ] call this an RC build only after targeted fixes
- [ ] step back from RC labeling and continue release-path hardening

Why?

Notes:  

What must happen next to justify that move?

Notes:  

---

# 10. Most important conclusion

In one sentence, is this build honestly eligible to be called an RC build?

Answer:  

Why or why not?

Notes:  

What is the single biggest reason to stay cautious, even if RC status is approved?

Notes:  

---

# 11. Signoff

Prepared by:  
Date:  

Reviewed by:  
Date:  

Decision owner signoff:  
Date:  

---

# 12. Honest reminder

An RC build label is only useful if it means something specific.

If the build is still too unstable, too weakly verified, or too misleadingly described for that label, this checkpoint should say so plainly.

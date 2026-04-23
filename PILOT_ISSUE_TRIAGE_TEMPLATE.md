# Pilot Issue Triage Template

## Why this template exists

This template is meant to be used when a pilot observation, confusion point, blocker, or repeated friction item needs to become a tracked issue.

Its job is to stop pilot findings from collapsing into vague notes like:
- "users were confused here"
- "this might need work"
- "we should probably fix this"

Instead, it turns each issue into a consistent record with:
- source
- severity
- scope
- pilot impact
- recommended next action

Use one copy of this template per issue.

---

# 1. Issue metadata

Issue title:  
Date logged:  
Logged by:  
Source session ID(s):  
Related pilot batch:  
Related screen / flow:  
Related PR / slice, if known:  

---

# 2. Issue type

Choose one primary type:
- [ ] comprehension
- [ ] trust / tone
- [ ] density / hierarchy
- [ ] interaction / flow
- [ ] personalization
- [ ] evidence / semantics
- [ ] regression / broken behavior
- [ ] pilot blocker
- [ ] other

Notes:  

---

# 3. Problem statement

What exactly went wrong?

Notes:  

What did the participant do, expect, or say that revealed the issue?

Notes:  

What would the product have needed to do instead for this to feel correct?

Notes:  

---

# 4. Scope and frequency

How many sessions showed this issue?
- [ ] 1
- [ ] 2
- [ ] 3+
- [ ] unknown yet

Does it appear to be:
- [ ] isolated
- [ ] recurring
- [ ] systemic
- [ ] not enough data yet

Notes:  

---

# 5. Severity

Choose one:
- [ ] low
- [ ] medium
- [ ] high
- [ ] blocking

Why?

Notes:  

---

# 6. Pilot impact

Does this issue threaten:
- [ ] first-use comprehension
- [ ] trust posture
- [ ] completion of the support loop
- [ ] Learn Me usefulness
- [ ] personalization value
- [ ] truthful interpretation of uncertainty
- [ ] safe continuation of pilot scope

Notes:  

---

# 7. Recommended handling

Choose the best current path:
- [ ] fix before next pilot batch
- [ ] fix during current pilot batch if possible
- [ ] document as caveat and continue
- [ ] observe further before deciding
- [ ] fold into broader cleanup work

Why?

Notes:  

---

# 8. Suggested next action

What should actually happen next?

Examples:
- rewrite specific copy
- simplify one interaction
- move a section higher/lower
- add a clearer label
- create a new regression test
- log as accepted risk for this pilot only

Action:  
Owner:  
Target phase / slice:  
Notes:  

---

# 9. Link to evidence

Relevant quotes, observations, or session references:

1.  
2.  
3.  

---

# 10. Resolution status

Current status:
- [ ] open
- [ ] in review
- [ ] planned
- [ ] fixed
- [ ] accepted risk
- [ ] closed as non-issue

Notes:  

---

# 11. Honest summary

Why does this issue matter?

Notes:  

What happens if it is ignored for too long?

Notes:  

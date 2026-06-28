# InsightMail - Demo Email Examples

This document contains sample emails to demonstrate InsightMail's AI-powered analysis capabilities.

---

## Example 1: Urgent Security Issue (High Risk)

### Email Content:
```
Subject: URGENT: Data Breach Detected - Immediate Action Required

Team,

I've just discovered that our customer database was accessed by an unauthorized user last night at 2:47 AM. 
This is extremely concerning as it contains sensitive PII including social security numbers, credit card 
information, and residential addresses for over 50,000 customers.

We need to act NOW:
1. Shut down the affected servers immediately
2. Contact our legal team about disclosure requirements
3. Notify the executive team within the next hour
4. Prepare customer communication

This could result in massive GDPR and CCPA violations if not handled properly. I'm furious that our 
security protocols failed. We need answers and we need them fast!

Please confirm receipt of this email and your immediate availability for an emergency meeting.

- John Smith
  Security Director
```

### Expected Analysis:

**Intent**: Urgent Action Required  
**Emotion**: Angry / Anxious  
**Urgency**: Critical (High Priority)  
**Risk Score**: 95/100

**Risk Breakdown**:
- Emotion Intensity: 95/100 (Anger and anxiety)
- Priority: 100/100 (Critical/Immediate)
- Compliance Risk: 98/100 (GDPR, CCPA violations mentioned)
- Escalation Likelihood: 90/100 (Executive notification required)

**Compliance Flags**:
- PII Exposure: Social Security Numbers, Credit Card Information, Residential Addresses
- GDPR Violation Risk
- CCPA Violation Risk
- Data Breach Disclosure Requirements

**Action Items**:
1. Shut down affected servers immediately
2. Contact legal team about disclosure requirements
3. Notify executive team within one hour
4. Prepare customer communication
5. Schedule emergency meeting

**Summary**: Critical security breach requiring immediate action. Unauthorized access to customer database containing 50,000+ records with sensitive PII. Multiple compliance violations possible (GDPR/CCPA). Immediate server shutdown and executive/legal notification required.

**Smart Reply (Professional Tone)**:
```
John,

Thank you for the immediate notification. I understand the severity of this situation.

I confirm receipt and am available immediately for the emergency meeting. I'm taking the following actions:

1. Coordinating server shutdown with infrastructure team (ETA: 15 minutes)
2. Legal team notification initiated
3. Executive briefing scheduled for [TIME]
4. Incident response team assembled

I'll join the emergency call and provide a detailed status report.

Best regards,
[Your Name]
```

---

## Example 2: Customer Complaint (Medium Risk)

### Email Content:
```
Subject: Disappointed with Recent Service

Hi Support Team,

I've been a loyal customer for 5 years, but I'm really disappointed with the service I received 
yesterday. I ordered a replacement part (#12345) which was supposed to arrive in 2 days, but it's 
now been a week and there's no tracking update.

When I called customer service, I was on hold for 45 minutes and then got disconnected. I tried 
the chat support, but the agent seemed confused and couldn't locate my order.

I understand things happen, but this is frustrating. I need this part for my business operations, 
and every day of delay costs me money. Can someone please look into this and get back to me today?

I'd appreciate a manager reviewing this situation.

Thanks,
Sarah Johnson
Account #: CUS-789456
```

### Expected Analysis:

**Intent**: Complaint / Request for Resolution  
**Emotion**: Frustrated / Disappointed  
**Urgency**: High (Same-day response requested)  
**Risk Score**: 62/100

**Risk Breakdown**:
- Emotion Intensity: 65/100 (Frustration and disappointment)
- Priority: 75/100 (Business impact, same-day response)
- Compliance Risk: 45/100 (Customer retention risk)
- Escalation Likelihood: 65/100 (Manager review requested)

**Compliance Flags**:
- Customer Retention Risk
- Service Level Agreement Potential Breach

**Action Items**:
1. Locate order #12345 and tracking information
2. Investigate customer service call disconnection
3. Review chat support interaction
4. Escalate to manager for review
5. Provide same-day response with resolution plan
6. Consider compensation for delays and poor service experience

**Summary**: Long-time customer (5 years) experiencing order delays and poor service. Part #12345 delayed beyond promised delivery. Multiple failed support attempts. Business impact mentioned. Manager escalation requested. Requires same-day resolution.

**Smart Reply (Empathetic Tone)**:
```
Dear Sarah,

I sincerely apologize for the frustration you've experienced. As a valued 5-year customer, you 
deserve much better service than this.

I've personally looked into your order (#12345) and can see the delays are unacceptable. Here's 
what I'm doing immediately:

1. Expediting your part shipment - it will arrive by [DATE] with tracking: [TRACKING#]
2. Investigating the call center disconnection to prevent future occurrences
3. Following up with the chat support team about your experience
4. Applying a [X%] credit to your account for the inconvenience

A manager will also be reaching out within 2 hours to discuss how we can make this right and 
prevent similar issues.

Thank you for your patience and loyalty. We value your business.

Warm regards,
[Your Name]
Customer Relations Manager
```

---

## Example 3: Routine Business Inquiry (Low Risk)

### Email Content:
```
Subject: Q1 2025 Budget Planning Meeting

Hi Team,

Hope everyone had a great weekend! I'm reaching out to schedule our Q1 2025 budget planning 
meeting. Based on everyone's availability, I'm proposing:

Date: December 10, 2024
Time: 2:00 PM - 4:00 PM EST
Location: Conference Room B (or Zoom link for remote attendees)

Agenda:
- Review Q4 2024 spending
- Discuss Q1 2025 projections
- Departmental budget requests
- Resource allocation priorities

Please let me know if this works for your schedule. If you have any specific items to add to the 
agenda, feel free to reply with suggestions.

Looking forward to a productive discussion!

Best,
Michael Chen
Finance Manager
```

### Expected Analysis:

**Intent**: Meeting Request / Coordination  
**Emotion**: Neutral / Professional  
**Urgency**: Low (Normal business timeline)  
**Risk Score**: 15/100

**Risk Breakdown**:
- Emotion Intensity: 10/100 (Neutral, professional tone)
- Priority: 30/100 (Routine planning, advance notice)
- Compliance Risk: 5/100 (Standard business process)
- Escalation Likelihood: 10/100 (No escalation needed)

**Compliance Flags**:
- None detected

**Action Items**:
1. Check calendar availability for December 10, 2:00-4:00 PM EST
2. Confirm attendance (in-person or remote)
3. Review Q4 2024 spending data before meeting
4. Prepare departmental budget requests
5. Submit agenda item suggestions if applicable

**Summary**: Routine Q1 2025 budget planning meeting request for December 10. Standard agenda covering Q4 review, Q1 projections, and resource allocation. Advance notice provided with clear agenda items.

**Smart Reply (Formal Tone)**:
```
Hi Michael,

Thank you for coordinating the Q1 2025 budget planning meeting.

December 10 at 2:00 PM EST works well for my schedule. I plan to attend in Conference Room B.

For the agenda, I'd like to add a brief discussion on technology infrastructure investments, 
as we're evaluating some cloud migration projects that would impact Q1 budget allocations.

I'll have my departmental budget requests prepared and will review Q4 spending prior to the meeting.

Best regards,
[Your Name]
```

---

## How to Test These Examples

### Using the Frontend:
1. Open InsightMail at `http://localhost:5173`
2. Copy one of the email examples above
3. Paste into the email analyzer text area
4. Select a tone for the smart reply (Professional, Empathetic, or Formal)
5. Click "Analyze Email"
6. Review the comprehensive analysis and smart reply

### Using curl:
```bash
# Example 1 - High Risk Security Issue
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: URGENT: Data Breach Detected...",
    "tone": "professional"
  }'

# Example 2 - Medium Risk Complaint
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Disappointed with Recent Service...",
    "tone": "empathetic"
  }'

# Example 3 - Low Risk Routine
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Q1 2025 Budget Planning Meeting...",
    "tone": "formal"
  }'
```

---

## Key Features Demonstrated

✅ **Risk Scoring**: 95/100 (Critical) → 62/100 (Medium) → 15/100 (Low)  
✅ **Emotion Detection**: Angry/Anxious → Frustrated → Neutral  
✅ **Intent Classification**: Urgent Action → Complaint → Meeting Request  
✅ **Compliance Flags**: PII exposure, GDPR/CCPA → SLA breach → None  
✅ **Action Item Extraction**: Specific, actionable tasks for each email  
✅ **Smart Replies**: Tone-appropriate responses (Professional, Empathetic, Formal)  
✅ **Urgency Assessment**: Critical → High → Low  
✅ **Summary Generation**: Concise overview of key points  

---

## Expected Response Times

- **Analysis**: 10-30 seconds (depends on Ollama model performance)
- **With RAG**: Additional 2-5 seconds for knowledge base context
- **Total**: ~15-35 seconds for complete analysis

---

**Tip**: For best results, ensure Ollama is running with both `gemma:2b` and `nomic-embed-text` models installed!

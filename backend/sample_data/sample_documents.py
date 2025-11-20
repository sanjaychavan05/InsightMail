"""
Sample Knowledge Base Documents for RAG
These documents will be used to enhance email analysis with company-specific context
"""

SAMPLE_DOCUMENTS = [
    {
        "title": "Email Communication Policy",
        "content": "Company Email Communication Policy. All employees must adhere to the following email communication guidelines: 1. Professional Tone: Maintain a professional and respectful tone in all business communications. 2. Confidentiality: Do not share confidential company information, trade secrets, or customer data via email unless using encrypted channels. 3. Response Time: Respond to urgent emails within 4 hours during business hours. Non-urgent emails should be responded to within 24 hours. 4. Data Privacy: Comply with GDPR, CCPA, and other data protection regulations. Do not send personally identifiable information (PII) without proper authorization. 5. Security: Report any suspicious emails to IT security immediately. Do not click on links or download attachments from unknown senders. 6. Appropriate Use: Email systems are for business purposes only. Personal use should be minimal and not interfere with work responsibilities. 7. Legal Holds: All emails may be subject to legal discovery. Do not delete emails related to ongoing investigations or litigation. Violations may result in disciplinary action up to and including termination.",
        "document_type": "policy",
        "source": "HR Department - Updated Q4 2024"
    },
    {
        "title": "Customer Data Protection Guidelines",
        "content": "Customer Data Protection and Privacy Guidelines. Our commitment to customer data protection: 1. Data Collection: Only collect customer data necessary for business purposes. 2. Data Storage: Customer data must be stored in approved, encrypted databases. 3. Access Control: Access to customer data is restricted to authorized personnel only. 4. Data Retention: Customer data should be retained only as long as necessary and in compliance with regulatory requirements. 5. Breach Response: Any suspected data breach must be reported to the Data Protection Officer within 1 hour of discovery. 6. Third-Party Sharing: Customer data must never be shared with third parties without explicit customer consent and legal review. 7. GDPR Compliance: Respect customer rights including right to access, right to erasure, and right to data portability. 8. Cross-Border Transfers: International data transfers must comply with applicable data transfer mechanisms. Contact privacy@company.com for questions.",
        "document_type": "policy",
        "source": "Legal & Compliance - 2024"
    },
    {
        "title": "Financial Information Handling",
        "content": "Guidelines for Handling Financial Information. 1. Confidential Financial Data: Financial statements, revenue figures, cost structures, and pricing information are confidential. 2. Email Security: Never send financial reports or sensitive financial data via unencrypted email. 3. Insider Information: Employees with access to material non-public financial information must comply with insider trading policies. 4. Approval Requirements: Sharing financial data externally requires CFO or VP Finance approval. 5. SOX Compliance: All financial communications must comply with Sarbanes-Oxley Act requirements. 6. Quarterly Quiet Periods: During earnings quiet periods, no financial information should be disclosed externally. 7. Audit Cooperation: Preserve all financial communications during audit periods. Violations may have legal and regulatory consequences.",
        "document_type": "policy",
        "source": "Finance Department"
    },
    {
        "title": "Incident Response Procedures",
        "content": "IT Security Incident Response Procedures. Classification of Incidents: HIGH URGENCY: Data breaches or suspected breaches, Ransomware or malware infections, Unauthorized access to systems, Service outages affecting customers, Security vulnerabilities being actively exploited. MEDIUM URGENCY: Suspicious activity detected, Potential phishing attempts, Policy violations, System performance issues. LOW URGENCY: General security questions, Policy clarifications, Routine maintenance notifications. Response Time Requirements: High Urgency - Immediate response, escalate to CISO within 15 minutes; Medium Urgency - Response within 2 hours; Low Urgency - Response within 24 hours. Reporting Channel: security@company.com or call IT Security hotline x5500. Do not attempt to investigate security incidents on your own.",
        "document_type": "guideline",
        "source": "IT Security Team"
    },
    {
        "title": "Common Email Response Templates FAQ",
        "content": "Frequently Asked Questions - Email Response Best Practices. Q: How should I respond to urgent customer complaints? A: Acknowledge receipt immediately, express empathy, provide a timeline for investigation, and escalate to customer success manager if needed. Q: What tone should I use for legal inquiries? A: Use a formal, professional tone. Forward to legal@company.com and avoid making commitments or legal interpretations. Q: How do I handle requests for confidential information? A: Verify the requester identity and authorization. If in doubt, escalate to your manager or compliance team. Q: What should I do if I receive a threatening email? A: Do not respond. Forward immediately to security@company.com and your manager. Q: How do I respond to media inquiries? A: Forward all media inquiries to PR team at pr@company.com. Do not provide statements or comments. Q: What is the appropriate response time for partner emails? A: Strategic partners 4 hours, Regular partners 24 hours, New inquiries 48 hours. Q: How should I handle complaints about employees? A: Forward to HR at hr@company.com. Do not engage directly with complaints about other employees.",
        "document_type": "faq",
        "source": "Corporate Communications"
    },
    {
        "title": "Contract and Legal Commitment Guidelines",
        "content": "Guidelines for Email Communications Involving Legal Commitments. WARNING: Emails can create legally binding commitments. 1. Authority to Commit: Only authorized signatories can make contractual commitments on behalf of the company. 2. Prohibited Phrases: Avoid using phrases like We guarantee, We promise, We commit to, unless you have explicit authority. 3. Negotiation Communications: Mark all contract negotiation emails as Subject to Contract or Without Prejudice. 4. Pricing Commitments: Price quotes must include expiration dates and disclaimer language. 5. Service Level Agreements: Do not commit to SLAs or delivery timelines without product/operations approval. 6. Liability Limitations: Include appropriate liability limitations and disclaimers in external communications. 7. Legal Review: Route all agreements, MOUs, and formal commitments through legal@company.com before sending. 8. Signature Authority: Check the Delegation of Authority matrix before making financial or contractual commitments. When in doubt, consult Legal Department.",
        "document_type": "policy",
        "source": "Legal Department"
    },
    {
        "title": "Workplace Conduct and Professional Communication",
        "content": "Professional Communication and Workplace Conduct Standards. All employees must maintain professional standards in email communications. 1. Respectful Communication: Treat all recipients with respect and dignity. Discriminatory, harassing, or abusive language is strictly prohibited. 2. Inclusive Language: Use gender-neutral and inclusive language. Avoid assumptions about gender, race, religion, or other protected characteristics. 3. Conflict Resolution: Address workplace conflicts professionally. If an email conversation becomes heated, pause and schedule a call or meeting. 4. Criticism and Feedback: Provide constructive feedback privately, not in group emails. Praise publicly when appropriate. 5. Cultural Sensitivity: Be mindful of cultural differences in communication styles, especially in global communications. 6. Emotional Intelligence: Consider the emotional impact of your words. Re-read emails before sending, especially when discussing sensitive topics. 7. Profanity and Slang: Avoid profanity and unprofessional slang in all business communications. 8. Humor and Sarcasm: Use caution with humor and sarcasm, which can be easily misinterpreted in written form. Report concerns about inappropriate communications to hr@company.com. Our values: Respect, Integrity, Collaboration, Excellence.",
        "document_type": "guideline",
        "source": "Human Resources"
    }
]

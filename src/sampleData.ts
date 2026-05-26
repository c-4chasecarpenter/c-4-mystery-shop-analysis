import { MysteryShopReport } from './types';

export const sampleMysteryShopReport: MysteryShopReport = {
  client: {
    dealershipName: "Summit Chevrolet Dealer",
    shopperName: "David Jenkins",
    submissionTimestamp: "May 15, 2026, 11:32 AM EST",
    vehicle: {
      year: "2026",
      make: "Chevrolet",
      model: "Silverado 1500",
      trim: "LT Trail Boss"
    },
    vin: "1G1RC6E49GF100XXX",
    websiteUrl: "https://www.summitchevrolet.com",
    passed: false,
    channels: {
      text: {
        timestamp: "May 15, 2026, 11:35 AM EST",
        minutesElapsed: 3,
        passedTarget: true
      },
      autoEmail: {
        timestamp: "May 15, 2026, 11:36 AM EST",
        minutesElapsed: 4,
        passedTarget: true
      },
      phoneCall: {
        timestamp: "May 15, 2026, 12:12 PM EST",
        minutesElapsed: 40,
        passedTarget: false
      },
      personalEmail: {
        timestamp: "May 15, 2026, 01:22 PM EST",
        minutesElapsed: 110,
        passedTarget: false
      }
    },
    messages: {
      autoEmail: {
        sender: "sales@summitchevrolet.com",
        recipient: "davidjenkins92@gmail.com",
        subject: "Thank you for your inquiry on the 2026 Chevrolet Silverado 1500 LT Trail Boss",
        date: "May 15, 2026, 11:36 AM EST",
        body: "Hello David,\n\nThank you for contacting Summit Chevrolet about the 2026 Chevrolet Silverado 1500 LT Trail Boss. We have received your inquiry and a sales representative will contact you shortly.\n\nVehicle Details:\nYear: 2026\nMake: Chevrolet\nModel: Silverado 1500\nTrim: LT Trail Boss\n\nIf you have any questions, please reply to this email or call us at 555-0199.\n\nSincerely,\nSummit Chevrolet Customer Care"
      },
      personalEmail: {
        sender: "Robert Cooper (Sales Consultant)",
        recipient: "davidjenkins92@gmail.com",
        subject: "Your Silverado 1500 LT Trail Boss inquiry at Summit Chevy",
        date: "May 15, 2026, 01:22 PM EST",
        body: "Hi David,\n\nSorry for the delay in getting back to you, we've had a busy morning here on the sales floor. I see you were interested in the 2026 Chevy Silverado Trail Boss. It's a gorgeous truck and we actually have one on the lot right now.\n\nWhen would you like to come in and take it for a drive? I have some openings this afternoon or tomorrow morning.\n\nBest,\n\nRobert Cooper\nSummit Chevrolet Sales\nCell: 555-0144"
      },
      textMessage: {
        senderPhone: "555-0182",
        date: "May 15, 2026, 11:35 AM EST",
        body: "Hi David, this is Robert at Summit Chevy! I got your inquiry on the Silverado. Are you looking to buy or lease? Let me know!"
      },
      phoneCall: {
        timestamp: "12:12 PM EST",
        duration: "2 min 15 sec",
        details: "Sales rep called to verify if David was still in the market. David asked about availability of other colors. Rep promised to email a list but failed to follow up."
      }
    },
    scores: {
      responseSpeed: 5,
      autoEmailQuality: 6,
      personalEmailQuality: 4,
      textQuality: 7,
      callResponse: 3
    },
    findings: {
      autoEmail: [
        { type: "positive", text: "Sent within 4 minutes, meeting the rapid response target." },
        { type: "positive", text: "Successfully uses shopper's name and references the specific vehicle make and model." },
        { type: "negative", text: "No VIN, pricing details, or specific imagery was provided in the email. It felt dry and generic." },
        { type: "neutral", text: "Call to action is passive, simply asking the user to call or reply if they have any questions." }
      ],
      personalEmail: [
        { type: "positive", text: "Friendly tone and correct references to the Silverado 1500 model." },
        { type: "negative", text: "Sent at 110 minutes, which is well outside the recommended 20 minute response window." },
        { type: "negative", text: "Failed to address the custom comment submitted on the lead form asking about utility bed covers." },
        { type: "neutral", text: "Incomplete signature. Missing the dealership's physical address and official website link." }
      ],
      textMessage: [
        { type: "positive", text: "Extremely rapid text outreach, received within 3 minutes of submission." },
        { type: "positive", text: "Identified the salesperson (Robert) and the dealership (Summit Chevy) clearly." },
        { type: "neutral", text: "Asked a standard buying vs leasing question immediately without providing initial value." }
      ],
      phoneCall: [
        { type: "negative", text: "Outbound call delayed until 40 minutes post lead. Target goal is within 20 minutes." },
        { type: "negative", text: "Salesperson promised to send a follow up email listing other color options but never did." },
        { type: "neutral", text: "Call was direct but felt slightly rushed and did not establish strong rapport." }
      ]
    },
    customerQuestion: "Are hard tri-fold utility bed covers available for this truck? If so, what are the options and pricing including installation?",
    responseQuality: {
      autoEmailPersonalization: "Strong",
      autoEmailVehicleDetail: "VIN + Price",
      autoEmailCtaQuality: "2 CTAs",
      textPersonalization: "None",
      textContentValue: "Opt-in Only",
      personalEmailReceived: "Not in 60 min",
      grammarSpelling: "Minor Issues",
      overallSpeedRating: "FAIL"
    }
  },
  competitor: {
    dealershipName: "Apex Chevrolet Group",
    shopperName: "David Jenkins",
    submissionTimestamp: "May 15, 2026, 11:32 AM EST",
    vehicle: {
      year: "2026",
      make: "Chevrolet",
      model: "Silverado 1500",
      trim: "LT Trail Boss"
    },
    vin: "1G1RC6E49GF122XYZ",
    websiteUrl: "https://www.apexchevrolet.com",
    passed: true,
    channels: {
      text: {
        timestamp: "May 15, 2026, 11:34 AM EST",
        minutesElapsed: 2,
        passedTarget: true
      },
      autoEmail: {
        timestamp: "May 15, 2026, 11:33 AM EST",
        minutesElapsed: 1,
        passedTarget: true
      },
      phoneCall: {
        timestamp: "May 15, 2026, 11:38 AM EST",
        minutesElapsed: 6,
        passedTarget: true
      },
      personalEmail: {
        timestamp: "May 15, 2026, 11:47 AM EST",
        minutesElapsed: 15,
        passedTarget: true
      }
    },
    messages: {
      autoEmail: {
        sender: "sales@apexchevrolet.com",
        recipient: "davidjenkins92@gmail.com",
        subject: "We've received your request for the 2026 Silverado Trail Boss LT!",
        date: "May 15, 2026, 11:33 AM EST",
        body: "Hi David,\n\nThank you for requesting information on the 2026 Silverado 1500 LT Trail Boss. Our online price is $58,450. We have configured a test drive appointment portal ready for you.\n\nQuick Specs:\n- VIN: 1G1RC6E49GF122XYZ\n- Core Color: Summit White\n- In-Stock Status: Yes (Awaiting Prep)\n\nWe will reach out to you shortly to answer any custom questions.\n\nBest regards,\nApex Chevrolet Sales Team"
      },
      personalEmail: {
        sender: "Sarah Peterson (Apex Customer Specialist)",
        recipient: "davidjenkins92@gmail.com",
        subject: "BED COVER INFO: 2026 Silverado 1500 LT Trail Boss",
        date: "May 15, 2026, 11:47 AM EST",
        body: "Hi David,\n\nFollowing up on our brief chat, here is the official spec sheet for the tri-fold hard utility bed covers. As mentioned on the phone, we have three different styles available starting at $850 including custom dealer installation.\n\nI have attached pictures of each installed on a trail boss model in the showroom. Let me know if you would like me to pre-install this on the Summit White Silverado before your test drive.\n\nSarah Peterson\nApex Chevrolet Group\nDirect: 555-0177"
      },
      textMessage: {
        senderPhone: "555-0111",
        date: "May 15, 2026, 11:34 AM EST",
        body: "Hey David, Sarah here from Apex Chevy. Thanks for checking out the Trail Boss. I am checking availability on bed covers for you right now. Can I call you in 2 minutes?"
      },
      phoneCall: {
        timestamp: "11:38 AM EST",
        duration: "3 min 40 sec",
        details: "Sarah called David immediately to verify color options and address his bed cover question from the comments section. Very professional, gathered trade info, scheduled appointment."
      }
    },
    scores: {
      responseSpeed: 10,
      autoEmailQuality: 9,
      personalEmailQuality: 9,
      textQuality: 9,
      callResponse: 9
    },
    findings: {
      autoEmail: [
        { type: "positive", text: "Ultrarapid auto-email delivered in under 60 seconds." },
        { type: "positive", text: "Includes specific, accurate pricing ($58,450) and VIN, providing solid immediate value." },
        { type: "positive", text: "Includes direct interactive buttons linking to test drive portals." }
      ],
      personalEmail: [
        { type: "positive", text: "Sent within 15 minutes of the lead, easily passing the 20-minute target." },
        { type: "positive", text: "Directly answered the consumer's question about utility bed covers with specific options and pricing." },
        { type: "positive", text: "Included showroom photos making the follow-up engaging and highly relevant." }
      ],
      textMessage: [
        { type: "positive", text: "Sent 2 minutes after lead submission. Polished, conversational, and direct." },
        { type: "positive", text: "Built immediate bridge to a phone call by asking for permission first." }
      ],
      phoneCall: [
        { type: "positive", text: "Outbound phone call in just 6 minutes. Outstanding, authoritative speed." },
        { type: "positive", text: "Demonstrated excellent soft phone skills by actively listening and scheduling the dealer visit." }
      ]
    },
    customerQuestion: "Are hard tri-fold utility bed covers available for this truck? If so, what are the options and pricing including installation?",
    responseQuality: {
      autoEmailPersonalization: "Generic",
      autoEmailVehicleDetail: "None",
      autoEmailCtaQuality: "Inventory Link",
      textPersonalization: "Name + Rep",
      textContentValue: "Engaging",
      personalEmailReceived: "5 min",
      grammarSpelling: "Clean",
      overallSpeedRating: "PASS"
    }
  },
  takeaways: [
    {
      priority: "Critical",
      emoji: "⏳",
      title: "Delayed Outbound Call and Overlooked Lead Comments",
      description: "Summit Chevrolet failed to place an outbound call until 40 minutes had elapsed. Furthermore, when they did call, the rep failed to address David's lead question regarding utility bed covers, which active competitor Sarah Peterson captured and resolved inside 15 minutes.",
      fullWidth: true
    },
    {
      priority: "Overhaul Needed",
      emoji: "✉️",
      title: "Excessive Personal Email Lag",
      description: "Taking 110 minutes to send a personal follow-up email completely disconnects the lead. Customers shop multiple stores simultaneously. This delay allowed Apex Chevrolet to lock in a test drive appointment before Summit even responded."
    },
    {
      priority: "Process Gap",
      emoji: "📝",
      title: "Incomplete Phone Session Follow-Up",
      description: "Salesperson Robert Cooper promised to email David a list of color options on the call but never did. Unfulfilled commitments degrade buyer trust and immediately deflect them to competitor models."
    },
    {
      priority: "Bright Spot",
      emoji: "⚡",
      title: "Rapid Initial SMS Connection",
      description: "David received the text message from Robert in just 3 minutes, identifying the salesperson and the dealership. This initial spark was superb, but was unfortunately squandered by slower subsequent channels."
    },
    {
      priority: "Quick Fix",
      emoji: "🔧",
      title: "Dry Automated Email Templates",
      description: "The automated email did its job by sending quickly, but was devoid of rich information like pricing, VINs, or dynamic images. Injecting actual inventory sheets will drastically improve engagement ratios."
    }
  ],
  metadata: {
    analysisDate: "May 15, 2026",
    notes: "Lead submitted simultaneously to Summit Chevrolet and Apex Chevrolet regarding a 2026 Chevrolet Silverado 1500 LT Trail Boss. Comparison details show clear performance and follow-up gaps."
  }
};

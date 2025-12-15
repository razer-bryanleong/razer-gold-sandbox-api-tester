graph TD
    A[Customer requests refund] --> B{Is merchant Tencent AND payment RG?};
    B -- Yes --> C[Refund possible triggered by Merchant];
    B -- No --> D{Is item unable to deliver?};
    D -- No --> E[Respond: 'Unfortunately, all transactions on the Razer Gold platform are final and cannot be reversed.'];
    D -- Yes --> F{Request via CA ticket?};
    F -- Yes --> G[Suggest top-up to RG wallet for other purchases];
    F -- No --> H{Is it a WeChat or similar case?};
    H -- Yes --> I[Pull BD in, ask Credit Note];
    I --> J{Can merchant manually provide item?};
    J -- Yes --> K[Case Closed];
    J -- No --> L[Pull BD in to negotiate like PearlAbyss case];
    H -- No --> M[Check with local team or payment team for other ways];
# Portfolio Tracker App - UI Screenshots & Features

## App Overview

The Portfolio Tracker app is a **dark-themed** React Native mobile application designed to help users track their investment portfolio including stocks, ETFs, and cryptocurrencies.

## Screen 1: Portfolio Dashboard 📊

### Layout
```
┌─────────────────────────────────────┐
│  ← My Portfolio              🌙     │  <- Header (Dark)
├─────────────────────────────────────┤
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Total Portfolio Value         ║  │  <- Purple gradient card
│  ║ $0.00                         ║  │
│  ║ Total Invested: $0.00         ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Portfolio Growth              ║  │  <- Chart card
│  ║                               ║  │
│  ║      📈 Line Chart            ║  │
│  ║     /                         ║  │
│  ║    /                          ║  │
│  ║   /___                        ║  │
│  ║                               ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Asset Breakdown               ║  │  <- Asset list
│  ║                               ║  │
│  ║ ● STOCK        $0.00          ║  │
│  ║ ● ETF          $0.00          ║  │
│  ║ ● CRYPTO       $0.00          ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Investment Targets      [Edit]║  │  <- Target tracking
│  ║                               ║  │
│  ║ Monthly Target                ║  │
│  ║ ▓▓▓░░░░░░░ 30%                ║  │
│  ║ $0 / $1,000                   ║  │
│  ║                               ║  │
│  ║ Yearly Target                 ║  │
│  ║ ▓░░░░░░░░░  5%                ║  │
│  ║ $0 / $12,000                  ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
├─────────────────────────────────────┤
│   📊 Portfolio     ➕ Add           │  <- Bottom tabs
└─────────────────────────────────────┘
```

### Features
- **Total Portfolio Value**: Large display showing current total value
- **Interactive Chart**: Line chart showing portfolio growth over time
- **Asset Breakdown**: Color-coded list of assets by type (stocks, ETFs, crypto)
- **Investment Targets**: Visual progress bars for monthly and yearly goals
- **Edit Targets**: Tap "Edit" to open modal for setting custom targets

### Target Settings Modal
When "Edit" is tapped:
```
┌─────────────────────────────────────┐
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Set Investment Targets        ║  │
│  ║                               ║  │
│  ║ Monthly Target ($)            ║  │
│  ║ [1000____________]            ║  │
│  ║                               ║  │
│  ║ Yearly Target ($)             ║  │
│  ║ [12000___________]            ║  │
│  ║                               ║  │
│  ║  [Cancel]  [Save]             ║  │
│  ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```

## Screen 2: Add Transaction ➕

### Layout
```
┌─────────────────────────────────────┐
│  ← Add Transaction          🌙      │  <- Header (Dark)
├─────────────────────────────────────┤
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Add New Transaction           ║  │
│  ║                               ║  │
│  ║ Asset Type                    ║  │
│  ║ [📈 Stock] [📊 ETF] [₿ Crypto]║  │  <- Toggle buttons
│  ║                               ║  │
│  ║ Asset Name                    ║  │
│  ║ [e.g., AAPL, BTC, VOO______] ║  │
│  ║                               ║  │
│  ║ Amount      Price ($)         ║  │
│  ║ [0_____]    [0.00_______]    ║  │
│  ║                               ║  │
│  ║ Total Investment: $0.00       ║  │
│  ║                               ║  │
│  ║     [Add Transaction]         ║  │  <- Big button
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Total Spending                ║  │  <- Cyan card
│  ║ $0.00                         ║  │
│  ║ 0 transactions                ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ Transaction History           ║  │
│  ║                               ║  │
│  ║ ┌───────────────────────────┐ ║  │
│  ║ │ AAPL              STOCK  ✕│ ║  │  <- Transaction card
│  ║ │ Amount: 10               │ ║  │
│  ║ │ Price: $150.00           │ ║  │
│  ║ │ Total: $1,500.00         │ ║  │
│  ║ │ Date: Feb 5, 2026        │ ║  │
│  ║ └───────────────────────────┘ ║  │
│  ║                               ║  │
│  ║ ┌───────────────────────────┐ ║  │
│  ║ │ BTC              CRYPTO ✕│ ║  │
│  ║ │ Amount: 0.5              │ ║  │
│  ║ │ Price: $45,000.00        │ ║  │
│  ║ │ Total: $22,500.00        │ ║  │
│  ║ │ Date: Feb 4, 2026        │ ║  │
│  ║ └───────────────────────────┘ ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
├─────────────────────────────────────┤
│   📊 Portfolio     ➕ Add           │  <- Bottom tabs
└─────────────────────────────────────┘
```

### Features
- **Asset Type Selection**: Toggle between Stock, ETF, and Crypto with emoji icons
- **Form Fields**: 
  - Asset Name (text input)
  - Amount (numeric input)
  - Price per unit (numeric input)
- **Real-time Total**: Shows calculated total investment as you type
- **Total Spending Card**: Cyan-colored summary of all spending
- **Transaction History**: Scrollable list of all transactions
- **Delete Functionality**: Each transaction has an ✕ button to delete

## Color Scheme (Dark Theme)

```
Background:      #121212 (Very dark gray)
Surface:         #1E1E1E (Dark gray)
Cards:           #2C2C2C (Medium gray)
Primary:         #BB86FC (Purple)
Secondary:       #03DAC6 (Cyan)
Accent:          #00BFA5 (Teal)
Text:            #FFFFFF (White)
Text Secondary:  #B3B3B3 (Light gray)
Border:          #3C3C3C (Gray)
```

## Navigation

The app uses bottom tab navigation with two tabs:
1. **📊 Portfolio**: Main dashboard with charts and targets
2. **➕ Add**: Transaction management screen

## Data Persistence

All data is stored locally using AsyncStorage:
- Transaction history
- Monthly and yearly targets
- Portfolio calculations

## Key User Flows

### Flow 1: Adding First Investment
1. Tap "Add" tab
2. Select asset type (e.g., Stock)
3. Enter asset name (e.g., "AAPL")
4. Enter amount (e.g., "10")
5. Enter price (e.g., "150")
6. See total preview: "$1,500.00"
7. Tap "Add Transaction"
8. See success message
9. Transaction appears in history below

### Flow 2: Setting Investment Targets
1. View Portfolio tab
2. Scroll to "Investment Targets" section
3. Tap "Edit" button
4. Enter monthly target (e.g., "5000")
5. Enter yearly target (e.g., "60000")
6. Tap "Save"
7. See updated progress bars

### Flow 3: Viewing Portfolio Growth
1. Open Portfolio tab
2. View total portfolio value at top
3. See line chart showing growth over time
4. Check asset breakdown by type
5. Monitor progress toward targets

## Technical Implementation

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation v7
- **Charts**: react-native-chart-kit
- **Storage**: AsyncStorage
- **State Management**: React Context API
- **Styling**: StyleSheet API with custom dark theme

## Responsive Design

The app is designed to work on various screen sizes and orientations, with:
- Flexible layouts using flexbox
- Responsive chart sizing based on screen width
- Touch-friendly button sizes
- Scrollable content for smaller screens

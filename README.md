# Portfolio Tracker App

A React Native mobile application for tracking your investment portfolio including stocks, ETFs, and cryptocurrencies, plus cash management - designed to be simple and intuitive like Delta or Yahoo Finance.

## Features

### 📊 Portfolio Dashboard
- **Total Portfolio Value**: Combined view of investments and cash balance
- **Portfolio Value Visualization**: Interactive line chart showing portfolio growth over time
- **Asset Breakdown**: Visual breakdown of investments by asset type (Stocks, ETFs, Crypto)
- **Investment Targets**: Set and track monthly and yearly investment goals
- **Dark Mode**: Modern dark theme for comfortable viewing

### 📈 Holdings View
- **Real-time Prices**: Fetch current market prices for all your holdings
- **Profit/Loss Tracking**: See gains/losses for each position with percentages
- **Performance Metrics**: Total portfolio performance at a glance
- **Average Cost Basis**: Track your average cost per share
- **Pull-to-Refresh**: Update all prices with a simple pull down gesture
- **Current vs Cost**: Compare current market value with total invested

### ➕ Add Transactions
- **Multiple Asset Types**: Support for stocks, ETFs, and cryptocurrencies
- **Smart Search**: Autocomplete search functionality with real-time suggestions
- **Real-time Price Fetching**: Automatic price lookup from live APIs
  - Stock prices via Finnhub API (free tier)
  - Crypto prices via CoinGecko API
- **Manual Price Refresh**: Update prices with a single tap
- **Transaction Management**: Add and delete investment transactions
- **Transaction History**: View complete history of all transactions with details
- **Real-time Calculations**: Automatic calculation of total investment value

### 💰 Cash Manager
- **Track Cash Balance**: Separate tracking for available cash
- **Deposit & Withdraw**: Easy cash management with deposit and withdrawal features
- **Set Balance**: Directly set your cash balance for initial setup
- **Total Portfolio Value**: See combined value of investments + cash

### 💾 Data Persistence
- All data is stored locally using AsyncStorage
- Your portfolio data persists between app sessions
- Cash balance is saved automatically
- No internet connection required (except for price updates)

## Technology Stack

- **Framework**: React Native with Expo
- **Web Support**: React Native Web for browser compatibility
- **Navigation**: React Navigation (Bottom Tabs)
- **Charts**: react-native-chart-kit
- **Storage**: AsyncStorage
- **APIs**: 
  - CoinGecko API for cryptocurrency data
  - Finnhub API for stock/ETF data (free tier with real-time quotes)
- **UI**: Custom dark theme with modern design inspired by Delta and Yahoo Finance

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed automatically)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LukaKljun/portfolioApp.git
cd portfolioApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For web browser
```

### Using Expo Go App

1. Install Expo Go on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code displayed in the terminal after running `npm start`

## Usage

### Managing Cash Balance
1. Navigate to the "Cash" tab (💰)
2. Tap "Deposit Cash" to add money to your portfolio
3. Tap "Withdraw Cash" to remove money
4. Tap "Set Balance" to directly set your current cash balance

### Adding a Transaction
1. Navigate to the "Add" tab (➕)
2. Select the asset type (Stock, ETF, or Crypto)
3. Start typing the asset name in the search box
4. Select from the autocomplete suggestions
5. The current price will be automatically fetched and populated
6. Adjust the price manually if needed, or tap the 🔄 button to refresh
7. Enter the amount of shares/units purchased
8. Review the total investment preview
9. Tap "Add Transaction"

**Note**: The app uses free API tiers with generous limits. Stock prices are fetched from Finnhub (60 API calls/minute) and crypto from CoinGecko.

### Viewing Holdings
1. Navigate to the "Holdings" tab (📈)
2. View all your current positions with real-time prices
3. See profit/loss for each holding
4. Pull down to refresh all prices
5. View total portfolio gain/loss at the top

### Setting Investment Targets
1. Navigate to the "Portfolio" tab (📊)
2. Scroll to the "Investment Targets" section
3. Tap "Edit" to open the target settings
4. Enter your monthly and yearly investment goals
5. Tap "Save"

### Viewing Portfolio
- The Portfolio Dashboard shows:
  - Total portfolio value (investments + cash)
  - Growth chart over time
  - Asset allocation breakdown
  - Progress toward monthly/yearly targets

## Project Structure

```
portfolioApp/
├── src/
│   ├── screens/
│   │   ├── PortfolioDashboard.js   # Main portfolio overview
│   │   ├── Holdings.js              # Holdings with P&L tracking
│   │   ├── AddTransaction.js        # Add/manage transactions
│   │   └── CashManager.js           # Cash balance management
│   ├── components/
│   │   └── SearchInput.js           # Autocomplete search component
│   ├── context/
│   │   └── PortfolioContext.js      # State management
│   └── utils/
│       ├── theme.js                  # Dark theme configuration
│       └── api.js                    # API service for prices
├── App.js                            # Main app component
├── package.json                      # Dependencies
└── README.md                         # This file
```

## API Information

### Stock & ETF Data
The app uses **Finnhub** for stock and ETF data:
- Free tier: 60 API calls per minute
- Real-time quotes for US stocks
- Symbol search functionality
- No API key required (using public demo key)
- Website: https://finnhub.io/

### Cryptocurrency Data
The app uses **CoinGecko** for cryptocurrency data:
- Free tier: 10-50 calls per minute
- Real-time prices for 10,000+ cryptocurrencies
- No API key required
- Website: https://www.coingecko.com/

## Features Similar to Delta & Yahoo Finance

✅ **Clean, simple interface** - Focus on what matters
✅ **Real-time prices** - Live market data for stocks and crypto
✅ **Profit/Loss tracking** - See your gains and losses clearly
✅ **Holdings view** - Detailed view of all positions
✅ **Cash tracking** - Manage cash alongside investments
✅ **Portfolio overview** - Total value at a glance
✅ **Dark mode** - Easy on the eyes
✅ **Pull-to-refresh** - Update prices easily

## Features Roadmap

Potential future enhancements:
- [x] Real-time price updates via API integration
- [x] Smart search with autocomplete
- [x] Profit/Loss tracking for holdings
- [x] Cash balance management
- [ ] Price history charts for individual assets
- [ ] Multiple portfolio support
- [ ] Export data to CSV
- [ ] Advanced analytics and performance metrics
- [ ] Dividend tracking
- [ ] Transaction categories and tags
- [ ] Search and filter in transaction history
- [ ] Backup and restore functionality
- [ ] Biometric authentication
- [ ] Multi-currency support
- [ ] Price alerts and notifications
- [ ] Sell transactions support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

# Portfolio Tracker App

A React Native mobile application for tracking your investment portfolio including stocks, ETFs, and cryptocurrencies.

## Features

### 📊 Portfolio Dashboard
- **Portfolio Value Visualization**: Interactive line chart showing portfolio growth over time
- **Asset Breakdown**: Visual breakdown of investments by asset type (Stocks, ETFs, Crypto)
- **Investment Targets**: Set and track monthly and yearly investment goals
- **Dark Mode**: Modern dark theme for comfortable viewing
- **Portfolio Summary**: Real-time display of total portfolio value and invested amount

### ➕ Add Transactions
- **Multiple Asset Types**: Support for stocks, ETFs, and cryptocurrencies
- **Transaction Management**: Add and delete investment transactions
- **Spending Tracker**: Track total spending across all investments
- **Transaction History**: View complete history of all transactions with details
- **Real-time Calculations**: Automatic calculation of total investment value

### 💾 Data Persistence
- All data is stored locally using AsyncStorage
- Your portfolio data persists between app sessions
- No internet connection required

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs)
- **Charts**: react-native-chart-kit
- **Storage**: AsyncStorage
- **UI**: Custom dark theme with modern design

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

### Adding a Transaction
1. Navigate to the "Add" tab
2. Select the asset type (Stock, ETF, or Crypto)
3. Enter the asset name (e.g., AAPL, BTC, VOO)
4. Enter the amount of shares/units purchased
5. Enter the price per share/unit
6. Tap "Add Transaction"

### Setting Investment Targets
1. Navigate to the "Portfolio" tab
2. Scroll to the "Investment Targets" section
3. Tap "Edit" to open the target settings
4. Enter your monthly and yearly investment goals
5. Tap "Save"

### Viewing Portfolio
- The Portfolio Dashboard shows:
  - Total portfolio value
  - Growth chart over time
  - Asset allocation breakdown
  - Progress toward monthly/yearly targets

## Project Structure

```
portfolioApp/
├── src/
│   ├── screens/
│   │   ├── PortfolioDashboard.js   # Main portfolio view
│   │   └── AddTransaction.js        # Add/manage transactions
│   ├── context/
│   │   └── PortfolioContext.js      # State management
│   └── utils/
│       └── theme.js                  # Dark theme configuration
├── App.js                            # Main app component
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Features Roadmap

Potential future enhancements:
- [ ] Real-time price updates via API integration
- [ ] Multiple portfolio support
- [ ] Export data to CSV
- [ ] Advanced analytics and performance metrics
- [ ] Dividend tracking
- [ ] Transaction categories and tags
- [ ] Search and filter functionality
- [ ] Backup and restore functionality
- [ ] Biometric authentication
- [ ] Multi-currency support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

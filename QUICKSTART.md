# Quick Start Guide 🚀

## What's New in Your Portfolio App

Your portfolio app has been completely enhanced! Here's what you can do now:

---

## 📱 Four Main Screens

### 1. 📊 Portfolio (Home)
**What you see:**
- Total portfolio value (investments + cash)
- Growth chart over time
- Asset breakdown (stocks, ETFs, crypto)
- Investment targets progress

**What to do:**
- Check your total wealth at a glance
- See how your portfolio grows over time
- Track progress toward monthly/yearly goals

---

### 2. 📈 Holdings (NEW!)
**What you see:**
- All your positions listed
- Current price vs what you paid
- Profit/Loss for each holding (in $ and %)
- Total portfolio gain/loss
- Green for gains, Red for losses

**What to do:**
- Pull down to refresh prices
- See which investments are winning/losing
- Track your overall performance

**This is the main new feature - like Delta/Yahoo Finance!**

---

### 3. ➕ Add Transaction
**What you see:**
- Search for stocks/ETFs/crypto
- Auto-filled prices
- Transaction history

**What to do:**
- Select asset type (Stock, ETF, or Crypto)
- Search for the asset (e.g., "AAPL" or "Bitcoin")
- Enter number of shares
- Add transaction

**Tip:** Prices auto-fill from live APIs! Just search and the current price loads automatically.

---

### 4. 💰 Cash Manager (NEW!)
**What you see:**
- Your current cash balance
- Deposit/Withdraw buttons
- Set balance option

**What to do:**
- Set your initial cash balance
- Deposit when you add money
- Withdraw when you take money out

**This tracks your uninvested cash separately!**

---

## 🎯 Common Tasks

### First Time Setup
```
1. Open the app
2. Go to Cash tab (💰)
3. Tap "Set Balance"
4. Enter how much cash you currently have
5. Go to Add tab (➕)
6. Add your existing investments
7. Done! Check Portfolio and Holdings
```

### Add Money to Portfolio
```
1. Go to Cash tab (💰)
2. Tap "Deposit Cash"
3. Enter amount (e.g., $1000)
4. Tap "Deposit"
5. Your cash balance increases
```

### Buy a Stock
```
1. Go to Add tab (➕)
2. Tap "Stock" button
3. Search for stock (e.g., "AAPL")
4. Select from list
5. Price auto-fills
6. Enter number of shares
7. Tap "Add Transaction"
```

### Check Your Profit/Loss
```
1. Go to Holdings tab (📈)
2. Pull down to refresh prices
3. See green (gains) or red (losses)
4. Total gain/loss shown at top
```

---

## 🔥 Cool Features

### Real-Time Prices
- Stock prices from Finnhub (free, reliable)
- Crypto prices from CoinGecko
- Just pull down to refresh in Holdings

### Profit/Loss Tracking
- See exactly how much you've gained/lost
- Both dollar amounts and percentages
- Color-coded for easy reading

### Cash Tracking
- Track uninvested cash
- See total portfolio value (investments + cash)
- Separate from investment tracking

### Smart Search
- Start typing asset name
- Autocomplete suggestions appear
- Prices auto-fill when you select

---

## 💡 Tips & Tricks

### Get Accurate Data
- Pull down in Holdings to refresh prices
- Price updates are free but rate-limited
- Don't spam refresh (1 asset per second)

### Track Everything
- Add all your investments
- Set your cash balance
- Set monthly/yearly targets
- Use the chart to see growth

### Stay Organized
- Delete wrong transactions easily
- History shows all transactions
- Each holding shows average cost

---

## ❓ FAQ

**Q: Do I need an internet connection?**
A: Only for searching assets and refreshing prices. All your data is stored locally.

**Q: Is my data safe?**
A: Yes! Everything is stored on your device only. No cloud, no servers, no tracking.

**Q: How often should I refresh prices?**
A: Whenever you want! But be gentle - the free APIs have limits (60 per minute).

**Q: Can I track crypto?**
A: Yes! Select "Crypto" when adding and search for any cryptocurrency.

**Q: What if I enter wrong data?**
A: Just delete the transaction and add it again correctly.

**Q: Where's my data stored?**
A: In AsyncStorage on your device. It persists between app restarts.

---

## 🐛 Troubleshooting

**Prices won't load?**
- Check internet connection
- Try again in a few seconds (might be rate limited)
- Manually enter price if needed

**Search isn't working?**
- Type at least 2 characters
- Try the ticker symbol (e.g., "AAPL" not "Apple")
- Check internet connection

**App won't start?**
- Run: `npm install`
- Run: `npm start`
- Try: `npm run web` for web version

---

## 🎓 What Makes This Like Delta/Yahoo Finance

✅ **Holdings View** - See all positions with P&L
✅ **Real Prices** - Live market data
✅ **Profit/Loss** - Green gains, red losses
✅ **Clean Interface** - No clutter
✅ **Quick Access** - Everything is 1 tap away
✅ **Cash Tracking** - Not just investments
✅ **Total Value** - See everything at once

---

## 🚀 Ready to Go!

Your app is ready to use right now:

```bash
npm install   # First time only
npm start     # Every time
```

Then scan QR code with Expo Go app, or press 'w' for web.

**Happy investing!** 📈💰

---

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `FEATURES.md` - Feature details
- `IMPLEMENTATION.md` - Technical details

Or open an issue on GitHub!

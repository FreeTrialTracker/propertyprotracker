const calculateResults = () => {
    const leaseReturn = convertedValues.totalPrice > 0 
      ? (convertedValues.totalLeaseCost / convertedValues.totalPrice) * 100 
      : 0;
    
    const difference = convertedValues.totalLeaseCost - totalMarketValue;
    const percentageDiff = totalMarketValue > 0 
      ? (difference / totalMarketValue) * 100 
      : 0;

    // Return results in specific order
    return [
      {
        title: 'Total Price',
        value: convertedValues.totalPrice,
        currency: selectedCurrency,
        info: 'Total property price',
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      },
      {
        title: 'Monthly Payment',
        value: convertedValues.monthlyPayment,
        currency: selectedCurrency,
        info: 'Your monthly lease payment'
      },
      {
        title: 'Total Lease Cost',
        value: convertedValues.totalLeaseCost,
        currency: selectedCurrency,
        info: `Total cost over ${duration} years`
      },
      {
        title: 'Market Monthly Rate',
        value: convertedValues.marketMonthlyPayment,
        currency: selectedCurrency,
        info: 'Current market monthly rate'
      },
      {
        title: 'Lease Return',
        value: `${leaseReturn.toFixed(2)}%`,
        info: 'Total lease cost as percentage of property price',
        type: leaseReturn >= 100 ? 'negative' : 'positive'
      },
      {
        title: 'Value Difference',
        value: Math.abs(difference),
        currency: selectedCurrency,
        percentage: Math.abs(percentageDiff),
        info: `${difference > 0 ? 'Above' : 'Below'} market value`,
        type: difference > 0 ? 'negative' : 'positive'
      }
    ];
  };
# Sample CSV Files

This directory contains sample CSV files that demonstrate various data types and use cases for the CSV Dashboard Generator. These files are designed to showcase different features of the application and provide realistic data for testing and demonstration purposes.

## Available Sample Files

### 📊 `sales.csv`
**Business sales data with product information**
- **Rows**: 60+ sales transactions
- **Columns**: Date, Product, Category, Region, Sales, Units, Profit, Discount
- **Data Types**: Dates, strings (categorical), numbers (currency, integers)
- **Use Case**: E-commerce sales analysis, product performance tracking
- **Features Demonstrated**:
  - Time series analysis (sales over time)
  - Categorical data (products, regions, categories)
  - Numeric aggregations (total sales, profit margins)
  - Regional performance comparisons

### 💰 `expenses.csv`
**Business expense tracking data**
- **Rows**: 50+ expense entries
- **Columns**: Date, Category, Subcategory, Description, Amount, Currency, Payment_Method, Vendor, Tax_Rate, Receipt_Number
- **Data Types**: Dates, strings (categorical), numbers (currency, percentages)
- **Use Case**: Expense management and financial reporting
- **Features Demonstrated**:
  - Multi-level categorization (Category → Subcategory)
  - Financial calculations (tax rates, totals)
  - Vendor analysis and spending patterns
  - Payment method distribution

### 🏃 `fitness.csv`
**Personal fitness and workout tracking data**
- **Rows**: 50+ workout sessions
- **Columns**: Date, Exercise_Type, Duration_Minutes, Calories_Burned, Heart_Rate_Avg, Heart_Rate_Max, Distance_KM, Steps, Workout_Intensity, Weather_Temp_C, Weather_Condition, Notes
- **Data Types**: Dates, strings (categorical), numbers (measurements, counts), mixed data types
- **Use Case**: Fitness tracking and health analytics
- **Features Demonstrated**:
  - Health metrics and performance tracking
  - Weather correlation with activity
  - Exercise type categorization
  - Time-based progress analysis

### 🌐 `web-analytics.csv`
**Website traffic and user behavior data**
- **Rows**: 50+ page view entries
- **Columns**: Date, Page_URL, Page_Title, Page_Views, Sessions, Unique_Visitors, Bounce_Rate, Avg_Session_Duration, Top_Referrer, Device_Type, Browser, Country, Traffic_Source, Conversion_Rate, Revenue
- **Data Types**: Dates, strings (URLs, categories), numbers (counts, rates, durations)
- **Use Case**: Website analytics and user behavior analysis
- **Features Demonstrated**:
  - Web traffic analysis and KPIs
  - Geographic and device segmentation
  - Conversion funnel tracking
  - Time-based trend analysis

## Data Characteristics

### Column Types Covered
- **Date/Time**: Various date formats and time-based data
- **Numeric**: Integers, decimals, percentages, currency values
- **Categorical**: Product categories, regions, exercise types, browsers
- **Text**: Descriptions, URLs, notes, identifiers
- **Boolean/Logical**: Intensity levels, weather conditions

### Data Quality Features
- **Realistic Values**: Based on actual business scenarios
- **Missing Data**: Some intentional gaps to test handling
- **Varied Distributions**: Different data patterns and ranges
- **Relationships**: Correlated data points for meaningful analysis

## Usage Instructions

1. **Upload to Application**: Use any of these files with the CSV Dashboard Generator
2. **Explore Features**: Try different chart types, field selections, and filters
3. **Test Functionality**: Verify data parsing, type inference, and visualization
4. **Demonstration**: Use for showcasing the application's capabilities

## File Specifications

- **Encoding**: UTF-8
- **Delimiter**: Comma (`,`)
- **Headers**: First row contains column names
- **Size Range**: 5KB - 15KB per file
- **Row Count**: 50-60 rows per file
- **Data Freshness**: Sample data from 2024

## Contributing

To add more sample files:
1. Follow the existing naming convention
2. Include diverse data types
3. Add realistic, varied data
4. Update this README with file description
5. Test with the application

## Notes

- All data is fictional and generated for demonstration purposes
- Files are optimized for the CSV Dashboard Generator's features
- Data includes various edge cases for comprehensive testing
- Files demonstrate different analytical use cases and chart types
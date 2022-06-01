# cardSignal2022

# Data Resources

## Sources

- Sealed Overview https://api.mtgstocks.com/sealed
- Sealed Set Details https://api.mtgstocks.com/sealed/3405
- Sealed Set Date/Price https://api.mtgstocks.com/sealed/3405/prices

## Models

Sealed Overview

```
  [{
    id: number // 817,
    name: string // "Double Masters 2022",
    slug: string // "817-double-masters-2022",
    abbreviation: string // "2X2",
    icon_class: string // "ss-2x2",
    date: number // 1657238400000,
    products: [{
        id: number, // 3401,
        name: string, // "Collector Booster Display Case",
        slug: string, //"3401-double-masters-2022-collector-booster-display-case",
        latestPrice: {
          "average": number, // 2300,
          "market": number // 2300,
        }
    }]
  }]
```

# Analytic Options

- Track the deviation between the highest price card and the average of cards

  1. Seeks to determine the overall quality of the set

- Track the deviation between the highest priced rare and the average of rares

  1. Seeks to determine the overall quality of the set

- Compare every set and see what the average growth is from years 1 to 2, 2 to 3, 3 - 4, ... till end

  1. Seeks to deterine the average expected growth of a set

# Processing

1. Make a daily request to https://api.mtgstocks.com/sealed and store contents in a .json file with the timestamp of the request

2. Pandas Dataframe

```

```

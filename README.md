# cardSignal2022

# Data Resources

- Sealed Overview https://api.mtgstocks.com/sealed

# Analytic Options

- Track the deviation between the highest price card and the average of cards

  1. Seeks to determine the overall quality of the set

- Track the deviation between the highest priced rare and the average of rares

  1. Seeks to determine the overall quality of the set

- Compare every set and see what the average growth is from years 1 to 2, 2 to 3, 3 - 4, ... till end

  1. Seeks to deterine the average expected growth of a set

# Processing

1. Make a daily request to https://api.mtgstocks.com/sealed and store contents in a .json file with the timestamp of the request


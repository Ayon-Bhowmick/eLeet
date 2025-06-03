TODO:

1. Set up the database connection:
    - Create an API endpoint to receive the solution data
    - Handle the data submission from the extension
    - Store the data in the database
  
The data we're currently capturing includes:
  - Problem name
  - Runtime and runtime percentile
  - Memory and memory percentile
  - Solution code
  - Difficulty
  - Submission date/time
  - 
We need to:
  - Replace the 'API_Holder' placeholder in the submit button handler with the actual API endpoint
  - Make sure the data format matches what the database expects

Additions:
  - Add a “complexity” column to solution table
        - Logic to determine time/space

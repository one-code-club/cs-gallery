# App Overview
This is a web app to be built with the following frameworks and technologies:
- next.js 15 latest
- TypeScript
- Prisma
- PostgreSQL
- Tailwind and ShadCN

# Features and Pages
## Login
- Users log in to the app by entering a nickname only, and the user's global IP address is also recorded as a part of the login. 
  - Roles
      - If a nickname ends with "?TA", then "TA" role is assignend. 
      - If a nickname is followed by "?[ADMIN CODE]", then the role is "ADMIN". The [ADMIN_CODE] is stored as an environment variable.
      - Otherwise, the role is set to "STUDENT". 
## Main Page
- "STUDENT" role users see [Submission Page], in which they upload a URL text. 
- "TA" sees [Voting Page]. 
- "ADMIN" sees [Admin Dashboard Page]. 
## Submission Page
- A user can enter a URL text and click [Submit] button. The url, nickname, user's IP address are recorded in DB. The IP address is used as a unique key. 
- If the user already submitted a URL, then fetch the URL text from DB. Otherwise, show "Enter a URL for your work" as a placeholder text. 
- If an entered URL doesn't contan [REQUIRED_TEXT] in .env file, invalidate the entry and ask users to try it again with a correct url. 
## Voting Page
- All submitted URLs are shown as cards. Each card contains, "Nickname", "URL" and a heart icon for voting. 
- Card items are sorted by "Nickname". 
- Each TA can vote up to 5 entries by clicking a heart icon in the card. 
  - The heart icon has no color by default. Whne a heart icon is clicked, change it to a red heart. If a red heart is clicked, change it to the default. 
  - When a TA clicks the Submit button at the upper right corner, save the votes. 
  - If a TA already voted, restore the votes by changing heart icon color. 
- Update all votings on the cards everytime voting is done, so all TAs can view the latest vote counts. 
## Admin Dashboard Page
 - Admin can reset all the votes by removing records from the Vote table. 
  - Show a confirm dialog before resetting the votes. 
  - Admin can see the list of currently logging-in users with "nickname", "IP address", "Role", "Submitted"" (Yes, if the user has submitted a url. Otherwise no)- Users are sorted by "Role" and "Nickname" ascendingly. 
  ## Header Component
- Place a header component and show the followings:
  - App Title: "Gallery - CS in ENglish:
  - Nickname (replace any characters after "?" inclusive).
  - Link to [Gallery Page].
## Gallery Page
- Show all submitted URLs in cards. Each card contains the followings:
  - Nickname
  - Link to the URL (as "a" link with "target="_blank").
  - The number of votes
  - Automatically refresh this page every 5 seconds. 

# Implementations
- Design UIs wiht a dark theme, using modern and slick tone and colors. 
- create ".env.local" with the following variables: 
  - ADMIN_CODE=1234
  - REQUIRED_TEXT=code.org
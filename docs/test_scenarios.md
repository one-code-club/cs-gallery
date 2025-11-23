# Test Scenarios
- Before this test is executed, make sure to clearn up the Submission, User and Vote tables records.

## Test Setups
全テストで次の6つのユーザーログインを事前設定する
- nickname: "MahiMahi", role: "STUDENT", IPAddress: "123.0.0.1"
- nickname: "AhiAhi", role: "STUDENT", IPAddress: "456.0.0.1"
- nickname: "Cotoji", role: "STUDENT", IPAddress: "789.0.0.1"
- nickname: "Masaki", role: "TA", IPAddress: "123.1.0.1"
- nickname: "Kenji", role: "TA", IPAddress: "456.1.0.1"
- nickname: "Itagaki", role: "ADMIN", IPAddress: "123.2.0.1"

## Login as MahiMahi
- Login as "MahiMahi" and check if it opens Submit Your Work page.
- If Succcessful, enter "test.co.org" and verify if it errors due to an invalid URL. 
- If invalidated, re-enter "test.code.org/test" to see if the entry is successful.
## Login as AhiAhi
- Login as "AhiAhi" and enter "ahi.code.org/test" and submit it. Verify if the submission is successful. 
## Login as Cotoji
- Login as "Cotoji" and enter "cotoji.code.org/test" and submit it. Verify if the submission is successful. 
## Login as Masaki
- Login in as "Masaki" by entering "Masaki?TA" to be a TA role. Then, check if it opens the Voting Page.
- Check if three cards are displaied in the Voting page.
- Vote for MahiMahi and AhiAhi and save the votes.
## Login as Kenji
- Login in as "Kenji" by entering "Kanji?TA" to be a TA role. Then, check if it opens the Voting Page.
- Check if three cards are displaied in the Voting page.
- Vote for MahiMahi and Cotoji and save the votes.
## Login as Itagaki
- Login in as "Itagaki" by entering "Itagaki?1234" to be a ADMIN role. Then, check if it opens the Admin Dashboard Page.
- Check if all 6 users are listed in the user list on the dashboard page. 
- Click "Gallery" in the Header to open the Gallery page. 
  - Verify if MahiMahi has 2 votes, AhiAhi has 1 vote and Cotoji has 1 vote. 

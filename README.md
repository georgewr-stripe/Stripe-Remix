![Stripe Remix](/public/remix-logo.png "Stripe Remix")

## Development

To get started developing, follow the steps to get setup

1. Clone the repo

    `git clone git@github.com:georgewr-stripe/Stripe-Remix.git`
2. Install the dependancies
        
    `yarn install`
3. Build the Chrome Extension

    `yarn build`

4. Load the extension
    
    After the build is complete, webpack will create a folder called "extension" in the root of the project. 
    
    Open up extensions on chrome via [chrome://extensions](chrome://extensions) and ensure "developer mode" is on.
    
    You should now be able to "Load Unpacked" the extension, spcifying the "extension" directory previously created.

5. Run the extension

    Open up a website and click on the Stripe Remix extension in the toolbar. 

Have fun! 🤘
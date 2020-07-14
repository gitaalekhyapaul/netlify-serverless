# Netlify Serverless API Demo - Sticky Notes Application

## **Author: [Gita Alekhya Paul](https://github.com/gitaalekhyapaul)**

### **The Medium Article accompanying this GitHub Repository can be found [here](#).**

## **Installation Instructions:**

```bash
#Install Netlify CLI (May require sudo privileges in some OSes)
npm install -g netlify-cli
# Install Dependencies (Will also compile the code.)
npm install

# To compile TypeScript code into JS and then compile into lambda functions
npm run build
# To start a local Node Server for development purposes
npm run start:dev
# To start the Netlify Dev Environment
npm run start:netlify
```

## **Important Notes While Deploying to Netlify:**

### Remember to set the Enviromental Variables:

```javascript
NODE_ENV = "production";
MONGO_URI = "<Your MongoDB Connection String>";
MONGO_DBNAME = "<Your MongoDB Database Name>";
```

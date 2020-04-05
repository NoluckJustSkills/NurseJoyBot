'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const { dialogflow, SignIn, SimpleResponse,BrowseCarouselItem,BrowseCarousel,Image,List,BasicCard, Button} = require('actions-on-google');
const rp = require('request-promise');
const https = require('https');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const app = dialogflow();
app.intent('Default Welcome Intent', (conv) => {
  conv.ask("Hi. I am nurse mathews. I can help you out on well being,covid info and general info.To start with we need your social security number please share.Please enter your social security number");
});

app.intent('FallbackMenu',(conv,params)=>{
  
  conv.ask("Hi Alice, Welcome back What would you like assistance with, Please select from the options below");
  conv.ask(new List({
    title: 'Assist Options',
    items: {
      // Add the first item to the list
      'wellbeing': {
        synonyms: [
          'Wellbeing',
        ],
        title: 'Well being',
        description: 'Get to know about exercises and book therapist appointments',
       
      },
      'covid': {
        synonyms: [
          'covidinfo',
          
         
        ],
        title: 'Covid Info',
        description: 'Get current corona statistics and connect with Health care professionals',
      },
      'general': {
        synonyms: [
          'generalinfo',
          
         
        ],
        title: 'General Info',
        description: 'Get general support from professionals and order food,medicines',
      },
    },
  }));
  
  console.log(params);
  
});

app.intent('social security no',(conv,params)=>{
  
  conv.ask("Hi Alice, Hope you are doing good! Your social security number is "+params.social_security_no+". We are getting your medical history mean while what would you like assistance with ");
  conv.ask(new List({
    title: 'Assist Options',
    items: {
      // Add the first item to the list
      'wellbeing': {
        synonyms: [
          'Wellbeing',
        ],
        title: 'Well being',
        description: 'Get to know about exercises and book therapist appointments',
       
      },
      'covid': {
        synonyms: [
          'covidinfo',
          
         
        ],
        title: 'Covid Info',
        description: 'Get current corona statistics and connect with Health care professionals',
      },
      'general': {
        synonyms: [
          'generalinfo',
          
         
        ],
        title: 'General Info',
        description: 'Get general support from professionals and order food,medicines',
      },
    },
  }));
  
  console.log(params);
  
});

app.intent('get option', (conv, input, option) => {
 
  const SELECTED_ITEM_RESPONSES = {
    'wellbeing': 'Would you prefer to watch a physiological exercise video ? Or book a appointment with online therapist',
    'covid': 'Global cases - 1,167,063, Deaths: - 62,691, Recovered: - 241,742. Would you prefer to have a self-test? Or connect to Health coach? Or connect to an online doctor?',
    'general':' Do you like some support in ordering medicines, food, or general support'
  };
  conv.ask(SELECTED_ITEM_RESPONSES[option]);

 });



app.intent('wellbeing',(conv,input)=>{

  if(conv.request.inputs[0].rawInputs[0].query.indexOf("exercise") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("watch") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("physiological") != -1){
    conv.ask("Here are some links to apps and youtube video of physiological exercise");
   conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'How To Get Slim Thighs in 9 Minutes',
        url: 'https://www.youtube.com/watch?v=413mo_18sxE',
        description: 'Watch youtube video to get slim thighs',
        image: new Image({
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/YouTube_social_white_square_%282017%29.svg/1200px-YouTube_social_white_square_%282017%29.svg.png',
          alt: 'Image alternate text',
        }),
      }),
      new BrowseCarouselItem({
     	title: 'Home workout App',
        url: 'https://play.google.com/store/apps/details?id=homeworkout.homeworkouts.noequipment',
        description: 'Home Workouts provides daily workout routines for all your main muscle groups. In just a few minutes a day',
        image: new Image({
          url: 'https://lh3.googleusercontent.com/Mxu4YhAr45fbX_iBwi4LiRuSDn9G8R-C_i6PF4Oqys6TqQab2Jl7U5w4WGDtoPwhpTk',
          alt: 'Image alternate text',
        }),
      }),
    ],
  }));
  
  }
  else if(conv.request.inputs[0].rawInputs[0].query.indexOf("appointment") != -1 || 
        conv.request.inputs[0].rawInputs[0].query.indexOf("therapist") != -1 ||  conv.request.inputs[0].rawInputs[0].query.indexOf("online") != -1  ){
    conv.ask("Book Appointment for online consultation");
    conv.ask(new BasicCard({
    text: `Book appointment for consultation`,
    subtitle: 'Appointment',
    title: 'Swedish primary care',
    buttons: new Button({
      title: 'Click to Book Appointment',
      url: 'https://www.swedish.org/services/primary-care',
    }),
    image: new Image({
      url: 'https://media-exp1.licdn.com/dms/image/C560BAQE7giXqp_Khgw/company-logo_200_200/0?e=2159024400&v=beta&t=v9OJnDrFUu6N0l_yZ6Emu2FIzIRiEQOODyqMg4-jRIg',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
  }
});


app.intent('covid',(conv,input)=>{
  if(conv.request.inputs[0].rawInputs[0].query.indexOf("self") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("treat myself") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("diagnoise") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("test") != -1){
   
    conv.ask("Here is a link how to self test for covid");
    conv.ask(new BasicCard({
    text: `Steps for self test covid`,
    subtitle: 'Self Test',
    title: 'Steps for self test covid',
    buttons: new Button({
      title: 'Click to Book Appointment',
      url: 'https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html',
    }),
    image: new Image({
      url: 'https://pbs.twimg.com/profile_images/880104586211581952/KPwn1JyQ_400x400.jpg',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
  }
  else if(conv.request.inputs[0].rawInputs[0].query.indexOf("health") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("expert") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("coach") != -1){
    
      conv.ask("Here is a link to chat with a health coach");
    conv.ask(new BasicCard({
    text: `Health Coach online`,
    subtitle: 'Health Coach',
    title: 'Health Coach Online',
    buttons: new Button({
      title: 'Click to Chat with online health coach',
      url: 'https://www.practo.com/doctors',
    }),
    image: new Image({
      url: 'http://icon-library.com/images/book-appointment-icon/book-appointment-icon-28.jpg',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
    
    
  }
  else if(conv.request.inputs[0].rawInputs[0].query.indexOf("online doctor") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("doctor") != -1){
    conv.ask("Here is a link to chat with a online doctor");
    conv.ask(new BasicCard({
    text: `Doctor online`,
    subtitle: 'Online',
    title: 'Doctor online`',
    buttons: new Button({
      title: 'Click to Chat with online doctor',
      url: 'https://www.practo.com/doctors',
    }),
    image: new Image({
      url: 'http://icon-library.com/images/book-appointment-icon/book-appointment-icon-28.jpg',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
    
  }
});


app.intent('general',(conv,input)=>{
  if(conv.request.inputs[0].rawInputs[0].query.indexOf("medicines") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("medicine") != -1 ){
   
    conv.ask("Here are some links to order medicines online");
    conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Meds',
        url: 'https://www.meds.se/',
        description: 'Order your medicines from meds',
        image: new Image({
          url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/ax0lfdnqox19wue1exll',
          alt: 'Image alternate text',
        }),
      }),
      new BrowseCarouselItem({
        title: 'Apoteket',
        url: 'https://www.apoteket.se/',
        description: 'Order your medicines from Apoteket',
        image: new Image({
          url: 'https://pbs.twimg.com/profile_images/466601655799009280/7qHHPTkV_400x400.png',
          alt: 'Image alternate text',
        }),
      }),
    ],
  }));
    
    
  }
  else if(conv.request.inputs[0].rawInputs[0].query.indexOf("food") != -1){
   conv.ask("Here are some links to order Food online");
    conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Foodora',
        url: 'https://www.foodora.se/',
        description: 'Order from Foodora',
        image: new Image({
          url: 'https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/26d51b6c72533163cfecb4f110075378',
          alt: 'Image alternate text',
        }),
      }),
         new BrowseCarouselItem({
        title: 'Ubereats',
        url: 'https://www.ubereats.com/se-en',
        description: 'Order from Ubereats',
        image: new Image({
          url: 'https://assetscdn1.paytm.com/images/catalog/product/D/DE/DEAFLAT-RS-75-OPAYT4EBE7D861/0x1920/70/0.jpg',
          alt: 'Image alternate text',
        }),
      }),
      new BrowseCarouselItem({
        title: 'Wolt',
        url: 'https://www.wolt.com/en/',
        description: 'Order from Wolt',
        image: new Image({
          url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Wolt-app-icon-2019.png',
          alt: 'Image alternate text',
        }),
      }),
    ],
  }));
   
  }
  else if(conv.request.inputs[0].rawInputs[0].query.indexOf("support") != -1 || conv.request.inputs[0].rawInputs[0].query.indexOf("volunteers") != -1){
   
      conv.ask("Here is a list of contacts of volunteers who are around you");
    conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Apotek',
        url: 'https://www.apoteket.se/',
        description: 'Description of item 1',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 1 footer',
      }),
      new BrowseCarouselItem({
        title: 'Meds',
        url: 'https://www.meds.se/',
        description: 'Description of item 2',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 2 footer',
      }),
    ],
  }));
    
  }	
  
  
  
});





exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
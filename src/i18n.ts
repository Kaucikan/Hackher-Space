import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      /* NAVBAR */
      home: "Home",
      howItWorks: "How It Works",
      logout: "Logout",
      getStarted: "Get Started",
      login: "Login",
      register: "Register",

      /* GENERAL */
      title: "Marketplace",
      subtitle: "Browse And Exchange Reusable Materials",
      search: "Search Materials Or Location",
      loading: "Loading Listings...",
      noListings: "No Listings Available",
      call: "Call",
      request: "Request",
      material: "Material",
      location: "Location",
      quantity: "Quantity",

      /* ALERTS */
      loginFirst: "Please Login First",
      requestSent: "Request Sent Successfully",
      requestFailed: "Request Failed",
      interestedMaterial: "Interested In This Material",

      /* CATEGORY */
      all: "All",
      metal: "Metal",
      plastic: "Plastic",
      energy: "Energy",
      chemical: "Chemical",
      wood: "Wood",

      /* AUTH */
      email: "Email Address",
      password: "Password",
      name: "Full Name",
      phone: "Phone Number",
      forgotPassword: "Forgot Password",
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      loginContinue: "Login To Continue",
      registerStart: "Create Account To Start",
      invalidEmail: "Invalid Email Address",
      passwordLength: "Password Must Be At Least 6 Characters",
      nameRequired: "Name Is Required",
      authFailed: "Authentication Failed",
      processing: "Processing...",
      signIn: "Sign In",
      noAccount: "Don't Have An Account?",
      alreadyAccount: "Already Have An Account?",

      /* DASHBOARD */
      dashboard: "Dashboard",
      addWaste: "Add Waste",
      marketplace: "Marketplace",
      messages: "Messages",
      myListings: "My Listings",
      carbon: "Carbon Calculator",
      digitalTwin: "Digital Twin",
      settings: "Settings",

      wasteListed: "Waste Listed",
      wasteReused: "Waste Reused",
      carbonSaved: "Carbon Saved",
      earnings: "Earnings",
      impactOverview: "Impact Overview",
      runSimulation: "Run Simulation",

      /* DIGITAL TWIN */
      simulationDesc: "Analyze And Optimize Environmental Impact",
      simulationResult: "Simulation Result",
      currentEmission: "Current Emission",
      optimizedEmission: "Optimized Emission",
      reduction: "Reduction",
      viewMarketplace: "View Marketplace",
      loadingSimulation: "Loading Simulation...",
      reuseSuggestion: "Recommended For Reuse",
      sustainableSuggestion: "Suitable For Sustainable Use",

      /* STATUS */
      available: "Available",
      reserved: "Reserved",
      delivered: "Delivered",

      /* MESSAGES */
      searchContacts: "Search Contacts",
      noContacts: "No Contacts",
      startConversation: "Start A Conversation",
      typeMessage: "Type A Message",
      noContactSelected: "No Contact Selected",

      /* CHATBOT */
      askAnything: "Ask Anything",
      aiTyping: "AI Is Typing...",
      showMarketplace: "Show Marketplace",
      addWasteBtn: "Add Waste",
      carbonCalculator: "Carbon Calculator",
      categories: "Categories",
    },
  },

  ta: {
    translation: {
      /* NAVBAR */
      home: "முகப்பு",
      howItWorks: "எப்படி செயல்படுகிறது",
      logout: "வெளியேறு",
      getStarted: "தொடங்கு",
      login: "உள்நுழை",
      register: "பதிவு செய்",

      /* GENERAL */
      title: "சந்தை",
      subtitle: "மீண்டும் பயன்படுத்தக்கூடிய பொருட்களை தேடுங்கள்",
      search: "பொருட்கள் அல்லது இடத்தை தேடுங்கள்",
      loading: "பட்டியல் ஏற்றப்படுகிறது...",
      noListings: "பொருட்கள் இல்லை",
      call: "அழை",
      request: "கோரிக்கை",
      material: "பொருள்",
      location: "இடம்",
      quantity: "அளவு",

      /* ALERTS */
      loginFirst: "முதலில் உள்நுழைக",
      requestSent: "கோரிக்கை அனுப்பப்பட்டது",
      requestFailed: "கோரிக்கை தோல்வி",
      interestedMaterial: "இந்த பொருளில் ஆர்வம் உள்ளது",

      /* CATEGORY */
      all: "அனைத்து",
      metal: "உலோகம்",
      plastic: "பிளாஸ்டிக்",
      energy: "ஆற்றல்",
      chemical: "ரசாயனம்",
      wood: "மரம்",

      /* AUTH */
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      name: "பெயர்",
      phone: "தொலைபேசி",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா",
      welcomeBack: "மீண்டும் வரவேற்கிறோம்",
      createAccount: "கணக்கு உருவாக்கவும்",
      loginContinue: "தொடர உள்நுழைக",
      registerStart: "தொடங்க கணக்கு உருவாக்கவும்",
      invalidEmail: "தவறான மின்னஞ்சல் முகவரி",
      passwordLength: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்",
      nameRequired: "பெயர் அவசியம்",
      authFailed: "உள்நுழைவு தோல்வி",
      processing: "செயலாக்கப்படுகிறது...",
      signIn: "உள்நுழை",
      noAccount: "கணக்கு இல்லையா?",
      alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",

      /* DASHBOARD */
      dashboard: "டாஷ்போர்டு",
      addWaste: "கழிவு சேர்க்க",
      marketplace: "சந்தை",
      messages: "செய்திகள்",
      myListings: "என் பட்டியல்",
      carbon: "கார்பன் கணிப்பான்",
      digitalTwin: "டிஜிட்டல் ட்வின்",
      settings: "அமைப்புகள்",

      wasteListed: "பட்டியலிட்ட கழிவு",
      wasteReused: "மீண்டும் பயன்படுத்தப்பட்டது",
      carbonSaved: "சேமிக்கப்பட்ட கார்பன்",
      earnings: "வருமானம்",
      impactOverview: "தாக்கம் கண்ணோட்டம்",
      runSimulation: "சிமுலேஷன் இயக்கவும்",

      /* DIGITAL TWIN */
      simulationDesc: "சுற்றுச்சூழல் தாக்கத்தை பகுப்பாய்வு செய்து மேம்படுத்துங்கள்",
      simulationResult: "சிமுலேஷன் முடிவு",
      currentEmission: "தற்போதைய வெளியீடு",
      optimizedEmission: "மேம்படுத்தப்பட்ட வெளியீடு",
      reduction: "குறைப்பு",
      viewMarketplace: "சந்தையை காண்க",
      loadingSimulation: "சிமுலேஷன் ஏற்றப்படுகிறது...",
      reuseSuggestion: "மீண்டும் பயன்படுத்த பரிந்துரைக்கப்படுகிறது",
      sustainableSuggestion: "நிலையான பயன்பாட்டிற்கு பொருத்தமானது",

      /* STATUS */
      available: "கிடைக்கும்",
      reserved: "ஒதுக்கப்பட்டது",
      delivered: "வழங்கப்பட்டது",

      /* MESSAGES */
      searchContacts: "தொடர்புகளை தேடுங்கள்",
      noContacts: "தொடர்புகள் இல்லை",
      startConversation: "உரையாடலை தொடங்குங்கள்",
      typeMessage: "செய்தி எழுதுங்கள்",
      noContactSelected: "தொடர்பு தேர்ந்தெடுக்கப்படவில்லை",

      /* CHATBOT */
      askAnything: "எதை வேண்டுமானாலும் கேளுங்கள்",
      aiTyping: "AI பதில் அளிக்கிறது...",
      showMarketplace: "சந்தை காண்பி",
      addWasteBtn: "கழிவு சேர்க்க",
      carbonCalculator: "கார்பன் கணிப்பான்",
      categories: "வகைகள்",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

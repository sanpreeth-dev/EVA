/**
 * Handles command-based navigation.
 * @param {string} query - The user input command.
 * @returns {string|null} - The path to navigate to, or null if command unknown.
 */
export const getCommandPath = (query) => {
    const command = query.trim().toLowerCase();
    
    switch(command) {
      case "home":
      case "dashboard":
        return "/";
      case "account":
      case "profile":
      case "settings":
        return "/account";
      case "guide":
      case "help":
      case "docs":
      case "userguide":
        return "/userGuide";
      case "about":
      case "info":
        return "/about";
      case "chat":
      case "eva":
      case "avatar":
        return "/avatar";
      case "login":
      case "signin":
         return "/login";
      case "signup":
      case "register":
         return "/signup";
      default:
         return null;
    }
  };

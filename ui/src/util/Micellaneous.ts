import {
  GameMode,
  Gender,
  RankLevel,
  RankType,
  ServerPreference,
} from "../models/FiltersModels";

export class Micellaneous {
  private static agentIcons: Array<string> = [
    "/images/icons/Astra_icon.webp",
    "/images/icons/Breach_icon.webp",
    "/images/icons/Brimstone_icon.webp",
    "/images/icons/Chamber_icon.webp",
    "/images/icons/Cypher_icon.webp",
    "/images/icons/Fade_icon.webp",
    "/images/icons/Harbor_icon.webp",
    "/images/icons/Jett_icon.webp",
    "/images/icons/KAYO_icon.webp",
    "/images/icons/Killjoy_icon.webp",
    "/images/icons/Neon_icon.webp",
    "/images/icons/Omen_icon.webp",
    "/images/icons/Phoenix_icon.webp",
    "/images/icons/Raze_icon.webp",
    "/images/icons/Reyna_icon.webp",
    "/images/icons/Sage_icon.webp",
    "/images/icons/Skye_icon.webp",
    "/images/icons/Sova_icon.webp",
    "/images/icons/Viper_icon.webp",
    "/images/icons/Yoru_icon.webp",
  ];

  private static backgroundAgents: Array<string> = [
    "/images/background/Astra.png",
    "/images/background/Breach.png",
    "/images/background/Brimstone.png",
    "/images/background/Chamber.png",
    "/images/background/Cypher.png",
    "/images/background/Fade.png",
    "/images/background/Harbor.png",
    "/images/background/Jett.png",
    "/images/background/KAYO.png",
    "/images/background/Killjoy.png",
    "/images/background/Neon.png",
    "/images/background/Omen.png",
    "/images/background/Phoenix.png",
    "/images/background/Raze.png",
    "/images/background/Reyna.png",
    "/images/background/Sage.png",
    "/images/background/Skye.png",
    "/images/background/Sova.png",
    "/images/background/Viper.png",
    "/images/background/Yoru.png",
  ];

  // Converts a string to Title Case
  public static toTitleCase(str: string) {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt?.charAt(0).toUpperCase() + txt?.substr(1).toLowerCase();
    });
  }

  // Map rank to string
  public static rankToString(rank: number[]) {
    let rankType = "";
    let rankLevel = "";

    switch (rank[0]) {
      case RankType.iron:
        rankType = "Iron";
        break;
      case RankType.bronze:
        rankType = "Bronze";
        break;
      case RankType.silver:
        rankType = "Silver";
        break;
      case RankType.gold:
        rankType = "Gold";
        break;
      case RankType.platinum:
        rankType = "Platinum";
        break;
      case RankType.diamond:
        rankType = "Diamond";
        break;
      case RankType.ascendant:
        rankType = "Ascendant";
        break;
      case RankType.immortal:
        rankType = "Immortal";
        break;
      case RankType.radiant:
        rankType = "Radiant";
        break;
    }

    switch (rank[1]) {
      case RankLevel.one:
        rankLevel = " 1";
        break;
      case RankLevel.two:
        rankLevel = " 2";
        break;
      case RankLevel.three:
        rankLevel = " 3";
        break;
    }

    return rankType + rankLevel;
  }

  // Map server preference to string
  public static serverPreferenceToString(
    serverPref: ServerPreference,
    longVersion: boolean = false
  ) {
    switch (serverPref) {
      case ServerPreference.na:
        return longVersion ? "N. America" : "NA";
      case ServerPreference.eu:
        return longVersion ? "Europe" : "EU";
      case ServerPreference.ap:
        return longVersion ? "Asia Pacific" : "AP";
      case ServerPreference.kr:
        return longVersion ? "Korea" : "KR";
    }
  }

  // Map gender to string
  public static genderToString(gender: Gender, longVersion: boolean = false) {
    switch (gender) {
      case Gender.woman:
        return longVersion ? "Woman" : "W";
      case Gender.man:
        return longVersion ? "Man" : "M";
      case Gender.nonBinary:
        return longVersion ? "Non-Binary" : "NB";
    }
  }

  // Get a specific icon
  public static getAgentIcon(idx: number, randomly: boolean = false) {
    if (!randomly) {
      if (idx < 0 || idx >= Micellaneous.agentIcons.length) idx = 0;
      return Micellaneous.agentIcons[idx];
    } else {
      idx = Math.floor(Math.random() * (Micellaneous.agentIcons.length - 1));
      return Micellaneous.agentIcons[idx];
    }
  }

  public static getBackgroundAgents(iconSrc: string) {
    const bgAgent1: number = Micellaneous.agentIcons.indexOf(iconSrc);
    if (bgAgent1 !== -1) {
      let bgAgent2: number = bgAgent1;
      while (bgAgent1 === bgAgent2) {
        bgAgent2 = Math.floor(Math.random() * 20);
      }
      const bgAgents = [
        Micellaneous.backgroundAgents[bgAgent1],
        Micellaneous.backgroundAgents[bgAgent2],
      ];
      return bgAgents;
    }
    return "";
  }

  public static playerTypeToString(playerType: GameMode) {
    if (playerType === GameMode.casual) return "Casual";
    else return "Competitive";
  }
}

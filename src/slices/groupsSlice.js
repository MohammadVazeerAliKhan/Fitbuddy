// activitySlice.js

import { createSlice } from "@reduxjs/toolkit";

export const groupsSlice = createSlice({
  name: "groups",
  initialState: [
    {
      groupName: "Gymnastics",
      imageUrl: "/Assets/Images/weightTraining.png",
      videoUrl:
        "https://videos.pexels.com/video-files/4745810/4745810-hd_1920_1080_25fps.mp4",
      groupTitle: "Strength Forge",
      groupDescription:
        "Build muscle and sculpt your body with our effective weight training routines.",
    },
    {
      groupName: "Meditate",
      imageUrl: "/Assets/Images/meditate.png",
      groupTitle: "Mindful Meditation",
      videoUrl:
        "https://videos.pexels.com/video-files/7521693/7521693-hd_1920_1080_25fps.mp4",
      groupDescription:
        "Quiet your mind and soothe your soul with our guided meditation sessions.",
    },
    {
      groupName: "Sports",
      imageUrl: "/Assets/Images/sports.png",
      groupTitle: "Sporty Squad",
      videoUrl:
        "https://videos.pexels.com/video-files/9240783/9240783-hd_1920_1080_25fps.mp4",
      groupDescription:
        "Train like an athlete and elevate your performance with our sports-inspired workouts!",
    },
    {
      groupName: "Cardio",
      imageUrl: "/Assets/Images/cardio.png",
      groupTitle: "Cardio Craze",
      videoUrl:
        "https://videos.pexels.com/video-files/6525502/6525502-hd_1920_1080_25fps.mp4",
      groupDescription:
        "Get your heart pumping and calories burning with our dynamic cardio workouts!",
    },
    {
      groupName: "Yoga",
      imageUrl: "/Assets/Images/yoga.png",
      groupTitle: "Yoga Bliss",
      videoUrl:
        "https://videos.pexels.com/video-files/8480432/8480432-hd_1920_1080_25fps.mp4",
      // "https://videos.pexels.com/video-files/4608977/4608977-hd_1080_1920_25fps.mp4",
      groupDescription:
        "Find inner peace and flexibility as you flow through rejuvenating yoga poses.",
    },
    {
      groupName: "Dance",
      imageUrl: "/Assets/Images/dance.png",
      groupTitle: "Dance Fusion",
      videoUrl:
        "https://videos.pexels.com/video-files/2795737/2795737-uhd_3840_2160_25fps.mp4",
      groupDescription:
        "Move and groove to the rhythm while toning muscles and boosting energy!",
    },

    {
      groupName: "Resistance",
      imageUrl: "/Assets/Images/strengthTraining.png"
      ,
      videoUrl:
        "https://videos.pexels.com/video-files/7676732/7676732-uhd_4096_2160_25fps.mp4",
      // "https://videos.pexels.com/video-files/6702520/6702520-hd_2048_1080_25fps.mp4",
      groupTitle: "Power Pump",
      groupDescription:
        "Get stronger and more powerful with our challenging strength training exercises.",
    },
    {
      groupName: "Slim Down",
      imageUrl: "/Assets/Images/weightloss.png",
      videoUrl:
        "https://videos.pexels.com/video-files/5310858/5310858-uhd_3840_2160_25fps.mp4",
      // "https://videos.pexels.com/video-files/7987315/7987315-hd_1080_1920_30fps.mp4",
      groupTitle: "Slim Down Solution",
      groupDescription:
        "Achieve your weight loss goals with our tailored workouts and nutrition tips!",
    },
  ],
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(...action.payload);
    },
    removeGroup: (state, action) => {
      state.groups = state.groups.filter(
        (activity) => activity !== action.payload
      );
    },
  },
});

export const groups = (state) => state.groups;

export const { addGroup, removeGroup } = groupsSlice.actions;

export default groupsSlice.reducer;

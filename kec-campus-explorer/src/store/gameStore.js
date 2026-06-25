import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  playerPosition: [0, 0, 45],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  nearbyBuilding: null,
  setNearbyBuilding: (b) => set({ nearbyBuilding: b }),

  infoPanelOpen: false,
  activeBuilding: null,
  openInfoPanel: (building) => set({ infoPanelOpen: true, activeBuilding: building }),
  closeInfoPanel: () => set({ infoPanelOpen: false, activeBuilding: null }),

  points: 0,
  addPoints: (p) => set((s) => ({ points: s.points + p })),

  badges: [],
  addBadge: (badge) =>
    set((s) => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),

  visitedBuildings: [],
  visitBuilding: (buildingName) => {
    const state = get();
    if (state.visitedBuildings.includes(buildingName)) return;
    const updated = [...state.visitedBuildings, buildingName];
    set({ visitedBuildings: updated });
    const missions = state.missions.map((m) => {
      if (m.completed) return m;
      if (m.trigger === buildingName) {
        if (m.rewardType === 'points') state.addPoints(m.rewardValue);
        if (m.rewardType === 'badge') state.addBadge(m.rewardValue);
        state.showToast(`\u2705 Mission Complete: ${m.title}! ${m.reward}`);
        return { ...m, completed: true };
      }
      if (Array.isArray(m.trigger)) {
        const nv = [...(m.visited || [])];
        if (m.trigger.includes(buildingName) && !nv.includes(buildingName)) nv.push(buildingName);
        const done = m.trigger.every((t) => nv.includes(t));
        if (done) {
          if (m.rewardType === 'badge') state.addBadge(m.rewardValue);
          if (m.rewardType === 'points') state.addPoints(m.rewardValue);
          state.showToast(`\u2705 Mission Complete: ${m.title}! ${m.reward}`);
          return { ...m, visited: nv, completed: true };
        }
        return { ...m, visited: nv };
      }
      return m;
    });
    set({ missions });
    // Campus Master: unlock at 10 visited
    if (updated.length >= 10) {
      const ms = get().missions.map((m) => {
        if (m.id === 8 && !m.completed) {
          state.addBadge('Campus Master');
          state.showToast('\ud83c\udfc6 Campus Master Badge Unlocked!');
          return { ...m, completed: true };
        }
        return m;
      });
      set({ missions: ms });
    }
  },

  npcsTalked: 0,
  talkToNPC: () => {
    const state = get();
    const newCount = state.npcsTalked + 1;
    set({ npcsTalked: newCount });
    const missions = state.missions.map((m) => {
      if (m.id === 3 && !m.completed) {
        const nc = (m.count || 0) + 1;
        if (nc >= m.required) {
          state.addBadge(m.rewardValue);
          state.showToast(`\u2705 Mission Complete: ${m.title}! ${m.reward}`);
          return { ...m, count: nc, completed: true };
        }
        state.showToast(`\ud83d\udde3\ufe0f Talked to ${nc}/${m.required} students`);
        return { ...m, count: nc };
      }
      return m;
    });
    set({ missions });
  },

  missions: [
    { id: 1, title: 'Find the IT Park', description: 'Walk to the IT Park building', reward: '+100 Points', rewardType: 'points', rewardValue: 100, completed: false, trigger: 'IT Park' },
    { id: 2, title: 'Visit Library & Auditorium', description: 'Visit both C.D. Memorial Library and Auditorium', reward: 'Campus Explorer Badge', rewardType: 'badge', rewardValue: 'Campus Explorer', completed: false, trigger: ['C.D. Memorial Library', 'Auditorium'], visited: [] },
    { id: 3, title: 'Talk to 5 Students', description: 'Interact with 5 NPC students on campus', reward: 'Student Network Badge', rewardType: 'badge', rewardValue: 'Student Network', completed: false, count: 0, required: 5 },
    { id: 4, title: 'Grab Food', description: 'Visit the KEC Food Court', reward: '+50 Points', rewardType: 'points', rewardValue: 50, completed: false, trigger: 'Food Court' },
    { id: 5, title: 'Catch the Bus', description: 'Walk to the Bus Stand', reward: 'Commuter Badge', rewardType: 'badge', rewardValue: 'Commuter', completed: false, trigger: 'Bus Stand' },
    { id: 6, title: 'Explore All Dept Blocks', description: 'Visit CSE, ECE, Mechanical and EEE blocks', reward: 'Department Explorer Badge', rewardType: 'badge', rewardValue: 'Department Explorer', completed: false, trigger: ['CSE Block', 'ECE Block', 'Mechanical Block', 'EEE Block'], visited: [] },
    { id: 7, title: 'Hit the Sports Ground', description: 'Walk to the KEC Sports Ground', reward: '+75 Points', rewardType: 'points', rewardValue: 75, completed: false, trigger: 'Sports Ground' },
    { id: 8, title: 'Campus Master', description: 'Visit 10 or more locations on campus', reward: 'Campus Master Badge', rewardType: 'badge', rewardValue: 'Campus Master', completed: false },
  ],

  timeOfDay: 0.35,
  setTimeOfDay: (t) => set({ timeOfDay: t }),
  autoTime: false,
  toggleAutoTime: () => set((s) => ({ autoTime: !s.autoTime })),

  toast: null,
  showToast: (msg) => { set({ toast: msg }); setTimeout(() => set({ toast: null }), 3500); },

  showControls: true,
  dismissControls: () => set({ showControls: false }),

  showMissions: true,
  toggleMissions: () => set((s) => ({ showMissions: !s.showMissions })),
}));

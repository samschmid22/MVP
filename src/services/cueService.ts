import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const beepUrl = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

let configured = false;

export const configureAudio = async () => {
  if (configured) return;
  configured = true;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
  } catch {
    configured = true;
  }
};

export const playCue = async (soundEnabled: boolean, vibrationEnabled: boolean) => {
  if (vibrationEnabled) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // no-op
    }
  }

  if (!soundEnabled) return;

  try {
    const { sound } = await Audio.Sound.createAsync({ uri: beepUrl }, { shouldPlay: true, volume: 0.7 });
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // If audio fails, haptics still provide a cue.
  }
};

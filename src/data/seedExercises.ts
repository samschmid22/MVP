import { Exercise, ExerciseCategory } from '../types/models';
import { normalizeText } from '../utils/text';

const baseVideo =
  'https://assets.mixkit.co/videos/preview/mixkit-man-doing-yoga-in-the-morning-3974-large.mp4';

const lottieMobility =
  'https://assets3.lottiefiles.com/packages/lf20_vf6g2f8n.json';
const lottiePosture =
  'https://assets1.lottiefiles.com/packages/lf20_gjmecwii.json';
const lottieBalance =
  'https://assets2.lottiefiles.com/packages/lf20_1pxqjqps.json';

const makeExercise = (
  id: string,
  name: string,
  category: ExerciseCategory,
  tags: string[],
  bodyAreas: string[],
  difficulty: Exercise['difficulty'] = 'Beginner',
  defaultDurationSec = 45,
): Exercise => ({
  id,
  name,
  normalizedName: normalizeText(name),
  category,
  tags,
  bodyAreas,
  difficulty,
  instructions: `Move with control and steady breathing during ${name}.`,
  defaultDurationSec,
  mediaType: 'video',
  mediaUrl: baseVideo,
  isCustom: false,
});

export const templateLottieByCategory = {
  stretch: lottieMobility,
  posture: lottiePosture,
  balance: lottieBalance,
};

export const seedExercises: Exercise[] = [
  makeExercise('ex_1', 'Cat-Cow Flow', 'Mobility', ['spine', 'warm'], ['Spine']),
  makeExercise('ex_2', 'Thread the Needle', 'Mobility', ['thoracic'], ['Shoulders', 'Spine']),
  makeExercise('ex_3', 'Worlds Greatest Stretch', 'Mobility', ['hips', 'dynamic'], ['Hips', 'Hamstrings']),
  makeExercise('ex_4', '90/90 Hip Switch', 'Mobility', ['hips', 'rotation'], ['Hips']),
  makeExercise('ex_5', 'Ankle Dorsiflexion Rock', 'Mobility', ['ankle'], ['Ankles']),
  makeExercise('ex_6', 'Deep Squat Hold', 'Mobility', ['hips', 'ankles'], ['Hips', 'Ankles']),
  makeExercise('ex_7', 'Shoulder CARs', 'Mobility', ['shoulder', 'rotation'], ['Shoulders']),
  makeExercise('ex_8', 'Hip CARs', 'Mobility', ['hip', 'rotation'], ['Hips'], 'Intermediate'),
  makeExercise('ex_9', 'Scapular Wall Slide', 'Posture', ['scapula', 'upper back'], ['Shoulders', 'Upper Back']),
  makeExercise('ex_10', 'Chin Tuck Hold', 'Posture', ['neck'], ['Neck']),
  makeExercise('ex_11', 'Wall Angels', 'Posture', ['thoracic', 'posture'], ['Upper Back']),
  makeExercise('ex_12', 'Prone Y Raise', 'Posture', ['shoulders'], ['Upper Back', 'Shoulders']),
  makeExercise('ex_13', 'Prone T Raise', 'Posture', ['scapula'], ['Upper Back']),
  makeExercise('ex_14', 'Band Pull Apart', 'Posture', ['upper back'], ['Upper Back', 'Shoulders']),
  makeExercise('ex_15', 'Doorway Pec Stretch', 'Posture', ['chest'], ['Chest']),
  makeExercise('ex_16', 'Thoracic Extension on Floor', 'Posture', ['thoracic'], ['Spine']),
  makeExercise('ex_17', 'Dead Bug', 'Stability', ['core'], ['Core']),
  makeExercise('ex_18', 'Bird Dog', 'Stability', ['core', 'coordination'], ['Core', 'Glutes']),
  makeExercise('ex_19', 'Side Plank', 'Stability', ['core', 'obliques'], ['Core'], 'Intermediate'),
  makeExercise('ex_20', 'Hollow Body Hold', 'Stability', ['core'], ['Core'], 'Intermediate'),
  makeExercise('ex_21', 'Glute Bridge March', 'Stability', ['glutes', 'core'], ['Glutes', 'Core']),
  makeExercise('ex_22', 'Pallof Press Hold', 'Stability', ['anti-rotation'], ['Core'], 'Intermediate'),
  makeExercise('ex_23', 'Single-Leg Romanian Deadlift Reach', 'Stability', ['hinge'], ['Hamstrings', 'Glutes'], 'Intermediate'),
  makeExercise('ex_24', 'Plank Shoulder Tap', 'Stability', ['core', 'anti-rotation'], ['Core', 'Shoulders']),
  makeExercise('ex_25', 'Single-Leg Balance Reach', 'Balance', ['ankle', 'proprioception'], ['Ankles']),
  makeExercise('ex_26', 'Tandem Stance Hold', 'Balance', ['static'], ['Ankles']),
  makeExercise('ex_27', 'Toe-Heel Walk', 'Balance', ['dynamic'], ['Feet', 'Ankles']),
  makeExercise('ex_28', 'Lateral Cone Tap', 'Balance', ['lateral'], ['Glutes', 'Ankles']),
  makeExercise('ex_29', 'Clock Reach Balance', 'Balance', ['single-leg'], ['Ankles', 'Hips']),
  makeExercise('ex_30', 'Single-Leg Eyes Closed Hold', 'Balance', ['advanced'], ['Ankles'], 'Advanced'),
  makeExercise('ex_31', 'Bosu Weight Shift', 'Balance', ['dynamic'], ['Ankles', 'Core'], 'Intermediate'),
  makeExercise('ex_32', 'Star Excursion Reach', 'Balance', ['athletic'], ['Ankles', 'Hips'], 'Advanced'),
  makeExercise('ex_33', 'Jumping Jacks', 'Warmup', ['cardio'], ['Full Body']),
  makeExercise('ex_34', 'High Knees March', 'Warmup', ['cardio'], ['Hips', 'Core']),
  makeExercise('ex_35', 'Arm Circles', 'Warmup', ['shoulders'], ['Shoulders']),
  makeExercise('ex_36', 'Leg Swings Front Back', 'Warmup', ['dynamic'], ['Hips', 'Hamstrings']),
  makeExercise('ex_37', 'Leg Swings Lateral', 'Warmup', ['dynamic'], ['Hips', 'Adductors']),
  makeExercise('ex_38', 'Walking Lunges', 'Warmup', ['legs'], ['Quads', 'Glutes']),
  makeExercise('ex_39', 'Inchworm Walkout', 'Warmup', ['posterior chain'], ['Hamstrings', 'Core']),
  makeExercise('ex_40', 'Spinal Roll Down', 'Warmup', ['spine'], ['Spine']),
  makeExercise('ex_41', 'Childs Pose Breathing', 'Cooldown', ['breathing'], ['Back']),
  makeExercise('ex_42', 'Supine Twist', 'Cooldown', ['spine'], ['Spine', 'Hips']),
  makeExercise('ex_43', 'Hamstring Strap Stretch', 'Cooldown', ['hamstring'], ['Hamstrings']),
  makeExercise('ex_44', 'Figure Four Stretch', 'Cooldown', ['glutes'], ['Glutes']),
  makeExercise('ex_45', 'Hip Flexor Kneeling Stretch', 'Cooldown', ['hip flexor'], ['Hips']),
  makeExercise('ex_46', 'Calf Wall Stretch', 'Cooldown', ['calves'], ['Calves']),
  makeExercise('ex_47', 'Lat Stretch on Bench', 'Cooldown', ['lats'], ['Upper Back']),
  makeExercise('ex_48', 'Neck Side Stretch', 'Cooldown', ['neck'], ['Neck']),
  makeExercise('ex_49', 'Quad Couch Stretch', 'Cooldown', ['quads'], ['Quads']),
  makeExercise('ex_50', 'Box Breathing', 'Cooldown', ['breath', 'reset'], ['Core']),
];

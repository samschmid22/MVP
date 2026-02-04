import { templateLottieByCategory } from '../data/seedExercises';
import { Exercise, MediaType } from '../types/models';
import { normalizeText, fuzzyScore } from '../utils/text';

export interface GeneratedExerciseMedia {
  normalizedName: string;
  tags: string[];
  instructions: string;
  durationDefault: number;
  mediaType: MediaType;
  mediaUrl: string;
}

export interface ExerciseMediaGenerator {
  generateExerciseMedia: (inputName: string) => Promise<GeneratedExerciseMedia>;
}

interface GeneratorContext {
  existingExercises: Exercise[];
}

const inferCategory = (name: string): 'stretch' | 'posture' | 'balance' => {
  if (/(wall|scap|thoracic|posture|neck|chin)/i.test(name)) return 'posture';
  if (/(balance|single-leg|stance|stork|reach)/i.test(name)) return 'balance';
  return 'stretch';
};

const fuzzyMatchExercise = (inputName: string, exercises: Exercise[]) => {
  const normalizedInput = normalizeText(inputName);
  let best: { exercise: Exercise; score: number } | null = null;

  exercises.forEach((exercise) => {
    const score = fuzzyScore(normalizedInput, exercise.normalizedName);
    if (!best || score > best.score) {
      best = { exercise, score };
    }
  });

  if (best && best.score >= 0.64) {
    return best.exercise;
  }

  return null;
};

const llmStub = async (inputName: string) => {
  const category = inferCategory(inputName);
  const baseTags = category === 'posture' ? ['posture', 'alignment'] : category === 'balance' ? ['balance', 'control'] : ['mobility', 'stretch'];
  return {
    name: inputName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    tags: [...baseTags, 'custom', 'ai-generated'],
    instructions:
      category === 'balance'
        ? 'Stand tall, engage core, and move slowly through controlled balance shifts.'
        : category === 'posture'
          ? 'Keep ribs down, neck long, and glide shoulder blades with slow repetitions.'
          : 'Breathe in and out as you move through a comfortable range of motion.',
    durationDefault: category === 'balance' ? 35 : 45,
    poseSequence:
      category === 'balance'
        ? ['stance', 'reach', 'hold', 'return']
        : category === 'posture'
          ? ['set', 'slide', 'hold', 'reset']
          : ['start', 'open', 'hold', 'switch'],
    category,
  };
};

export class LocalExerciseMediaGenerator implements ExerciseMediaGenerator {
  private existingExercises: Exercise[];

  constructor(context: GeneratorContext) {
    this.existingExercises = context.existingExercises;
  }

  async generateExerciseMedia(inputName: string): Promise<GeneratedExerciseMedia> {
    const matched = fuzzyMatchExercise(inputName, this.existingExercises);

    if (matched) {
      return {
        normalizedName: matched.normalizedName,
        tags: matched.tags,
        instructions: matched.instructions,
        durationDefault: matched.defaultDurationSec,
        mediaType: matched.mediaType,
        mediaUrl: matched.mediaUrl,
      };
    }

    const generated = await llmStub(inputName);

    // TODO: replace llmStub with real LLM endpoint call returning structured JSON.
    // TODO: replace template Lottie with real text-to-video/text-to-lottie generation result.

    return {
      normalizedName: normalizeText(generated.name),
      tags: generated.tags,
      instructions: generated.instructions,
      durationDefault: generated.durationDefault,
      mediaType: 'lottie',
      mediaUrl: templateLottieByCategory[generated.category],
    };
  }
}

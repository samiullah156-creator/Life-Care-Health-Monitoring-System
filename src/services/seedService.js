import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { exercisePlans, dietPlans, recipes, healthTips } from '../data/seedData';

export async function loadSeedData() {
  const results = { exercisePlans: 0, dietPlans: 0, recipes: 0, healthTips: 0 };
  for (const item of exercisePlans) {
    await addDoc(collection(db, 'exercisePlans'), item);
    results.exercisePlans++;
  }
  for (const item of dietPlans) {
    await addDoc(collection(db, 'dietPlans'), item);
    results.dietPlans++;
  }
  for (const item of recipes) {
    await addDoc(collection(db, 'recipes'), item);
    results.recipes++;
  }
  for (const item of healthTips) {
    await addDoc(collection(db, 'healthTips'), { ...item, createdByDoctor: null });
    results.healthTips++;
  }
  return results;
}

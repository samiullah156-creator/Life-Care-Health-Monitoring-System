import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { loadSeedData } from '../../services/seedService';

const tabs = [
  { id: 'recipes', label: 'Recipes' },
  { id: 'dietPlans', label: 'Diet Plans' },
  { id: 'exercisePlans', label: 'Exercise Plans' },
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [recipe, setRecipe] = useState({ title: '', videoUrl: '', ingredients: '', instructions: '', category: 'healthy' });
  const [dietPlan, setDietPlan] = useState({ title: '', description: '', calories: '' });
  const [exercisePlan, setExercisePlan] = useState({ title: '', description: '', difficulty: 'beginner' });
  const [loadingSeed, setLoadingSeed] = useState(false);

  const handleLoadSeed = async () => {
    if (!confirm('Load sample exercises, diet plans, recipes, and health tips? This adds new items (does not replace).')) return;
    setLoadingSeed(true);
    setMessage('');
    try {
      const r = await loadSeedData();
      setMessage(`Loaded: ${r.exercisePlans} exercises, ${r.dietPlans} diet plans, ${r.recipes} recipes, ${r.healthTips} health tips.`);
    } catch (err) {
      setMessage(err.message || 'Failed to load sample data.');
    } finally {
      setLoadingSeed(false);
    }
  };

  const addRecipe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'recipes'), {
        title: recipe.title,
        videoUrl: recipe.videoUrl || null,
        ingredients: recipe.ingredients ? recipe.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
        instructions: recipe.instructions || '',
        category: recipe.category || 'healthy',
      });
      setRecipe({ title: '', videoUrl: '', ingredients: '', instructions: '', category: 'healthy' });
      setMessage('Recipe added.');
    } catch (err) {
      setMessage(err.message || 'Failed to add recipe.');
    } finally {
      setSubmitting(false);
    }
  };

  const addDietPlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'dietPlans'), {
        title: dietPlan.title,
        description: dietPlan.description,
        calories: dietPlan.calories || '',
      });
      setDietPlan({ title: '', description: '', calories: '' });
      setMessage('Diet plan added.');
    } catch (err) {
      setMessage(err.message || 'Failed to add diet plan.');
    } finally {
      setSubmitting(false);
    }
  };

  const addExercisePlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'exercisePlans'), {
        title: exercisePlan.title,
        description: exercisePlan.description,
        difficulty: exercisePlan.difficulty,
      });
      setExercisePlan({ title: '', description: '', difficulty: 'beginner' });
      setMessage('Exercise plan added.');
    } catch (err) {
      setMessage(err.message || 'Failed to add exercise plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Content</h1>
        <button
          type="button"
          onClick={handleLoadSeed}
          disabled={loadingSeed}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-70"
        >
          {loadingSeed ? 'Loading...' : 'Load sample data (exercises, diets, recipes, tips)'}
        </button>
      </div>
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === t.id ? 'bg-life-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {message && (
        <p className={`mb-4 text-sm ${message.includes('added') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      )}

      {activeTab === 'recipes' && (
        <form onSubmit={addRecipe} className="max-w-lg space-y-4 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900">Add Recipe</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => setRecipe((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (embed or link)</label>
            <input
              type="url"
              value={recipe.videoUrl}
              onChange={(e) => setRecipe((p) => ({ ...p, videoUrl: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
            <input
              type="text"
              value={recipe.ingredients}
              onChange={(e) => setRecipe((p) => ({ ...p, ingredients: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="flour, sugar, eggs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={recipe.category}
              onChange={(e) => setRecipe((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="halal">Halal</option>
              <option value="healthy">Healthy</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={recipe.instructions}
              onChange={(e) => setRecipe((p) => ({ ...p, instructions: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
            {submitting ? 'Adding...' : 'Add Recipe'}
          </button>
        </form>
      )}

      {activeTab === 'dietPlans' && (
        <form onSubmit={addDietPlan} className="max-w-lg space-y-4 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900">Add Diet Plan</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={dietPlan.title}
              onChange={(e) => setDietPlan((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={dietPlan.description}
              onChange={(e) => setDietPlan((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories (optional)</label>
            <input
              type="text"
              value={dietPlan.calories}
              onChange={(e) => setDietPlan((p) => ({ ...p, calories: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="e.g. 2000"
            />
          </div>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
            {submitting ? 'Adding...' : 'Add Diet Plan'}
          </button>
        </form>
      )}

      {activeTab === 'exercisePlans' && (
        <form onSubmit={addExercisePlan} className="max-w-lg space-y-4 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900">Add Exercise Plan</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={exercisePlan.title}
              onChange={(e) => setExercisePlan((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={exercisePlan.description}
              onChange={(e) => setExercisePlan((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={exercisePlan.difficulty}
              onChange={(e) => setExercisePlan((p) => ({ ...p, difficulty: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
            {submitting ? 'Adding...' : 'Add Exercise Plan'}
          </button>
        </form>
      )}
    </div>
  );
}

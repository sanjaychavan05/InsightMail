import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Zap, Database } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getSettings, updateSettings, Settings as SettingsType } from '../services/api';
import { toast } from 'sonner';

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (loading) {
    return (
      <div className="h-full p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="h-full p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your InsightMail AI preferences</p>
        </div>

        {/* RAG Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">RAG Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-rag">Enable RAG</Label>
                <p className="text-gray-500">Use knowledge base context for analysis</p>
              </div>
              <Switch 
                id="enable-rag" 
                checked={settings.enable_rag}
                onCheckedChange={(checked) => updateSetting('enable_rag', checked)}
              />
            </div>
            <div>
              <Label htmlFor="rag-top-k">Top K Results</Label>
              <Input
                id="rag-top-k"
                type="number"
                min={1}
                max={10}
                value={settings.rag_top_k}
                onChange={(e) => updateSetting('rag_top_k', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-gray-500 mt-1">
                Number of relevant documents to retrieve
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">AI Analysis Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-compliance">Compliance Check</Label>
                <p className="text-gray-500">Detect compliance issues in emails</p>
              </div>
              <Switch 
                id="enable-compliance" 
                checked={settings.enable_compliance_check}
                onCheckedChange={(checked) => updateSetting('enable_compliance_check', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-emotion">Emotion Analysis</Label>
                <p className="text-gray-500">Analyze emotional tone of emails</p>
              </div>
              <Switch 
                id="enable-emotion" 
                checked={settings.enable_emotion_analysis}
                onCheckedChange={(checked) => updateSetting('enable_emotion_analysis', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-smart-reply">Smart Reply</Label>
                <p className="text-gray-500">Generate suggested responses</p>
              </div>
              <Switch 
                id="enable-smart-reply" 
                checked={settings.enable_smart_reply}
                onCheckedChange={(checked) => updateSetting('enable_smart_reply', checked)}
              />
            </div>
          </div>
        </div>

        {/* LLM Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">LLM Configuration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="llm-model">Model Name</Label>
              <Input
                id="llm-model"
                type="text"
                placeholder="gemma:2b"
                value={settings.llm_model}
                onChange={(e) => updateSetting('llm_model', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="llm-temperature">Temperature</Label>
              <Input
                id="llm-temperature"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={settings.llm_temperature}
                onChange={(e) => updateSetting('llm_temperature', parseFloat(e.target.value))}
                className="mt-1"
              />
              <p className="text-gray-500 mt-1">
                Controls randomness (0=focused, 1=creative)
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={saving}
          >
            <Settings className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

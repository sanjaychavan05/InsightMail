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

        {/* API Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">API Configuration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                type="text"
                placeholder="https://api.example.com/analyze"
                value={settings.api_endpoint}
                onChange={(e) => updateSetting('api_endpoint', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={settings.api_key}
                onChange={(e) => updateSetting('api_key', e.target.value)}
                className="mt-1"
              />
              <p className="text-gray-500 mt-1">
                Your API key is encrypted and stored securely
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
                <Label htmlFor="auto-analyze">Auto-analyze emails</Label>
                <p className="text-gray-500">Automatically analyze emails as they arrive</p>
              </div>
              <Switch 
                id="auto-analyze" 
                checked={settings.auto_analyze}
                onCheckedChange={(checked) => updateSetting('auto_analyze', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sentiment-detection">Enhanced sentiment detection</Label>
                <p className="text-gray-500">Use advanced AI models for better accuracy</p>
              </div>
              <Switch 
                id="sentiment-detection" 
                checked={settings.enhanced_sentiment}
                onCheckedChange={(checked) => updateSetting('enhanced_sentiment', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="action-items">Extract action items</Label>
                <p className="text-gray-500">Automatically identify tasks from emails</p>
              </div>
              <Switch 
                id="action-items" 
                checked={settings.extract_action_items}
                onCheckedChange={(checked) => updateSetting('extract_action_items', checked)}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-urgency">High urgency alerts</Label>
                <p className="text-gray-500">Get notified for high-priority emails</p>
              </div>
              <Switch 
                id="high-urgency" 
                checked={settings.high_urgency_alerts}
                onCheckedChange={(checked) => updateSetting('high_urgency_alerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compliance-alerts">Compliance alerts</Label>
                <p className="text-gray-500">Receive notifications for compliance issues</p>
              </div>
              <Switch 
                id="compliance-alerts" 
                checked={settings.compliance_alerts}
                onCheckedChange={(checked) => updateSetting('compliance_alerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-summary">Daily summary</Label>
                <p className="text-gray-500">Get a daily digest of email analytics</p>
              </div>
              <Switch 
                id="daily-summary" 
                checked={settings.daily_summary}
                onCheckedChange={(checked) => updateSetting('daily_summary', checked)}
              />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-retention">Data retention (30 days)</Label>
                <p className="text-gray-500">Automatically delete analyzed emails after 30 days</p>
              </div>
              <Switch 
                id="data-retention" 
                checked={settings.data_retention_days === 30}
                onCheckedChange={(checked) => updateSetting('data_retention_days', checked ? 30 : 0)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymize">Anonymize sensitive data</Label>
                <p className="text-gray-500">Remove PII from stored email data</p>
              </div>
              <Switch 
                id="anonymize" 
                checked={settings.anonymize_pii}
                onCheckedChange={(checked) => updateSetting('anonymize_pii', checked)}
              />
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

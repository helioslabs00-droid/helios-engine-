import React, { useState } from 'react';
import {
  Globe,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CompanyInput, UploadedAsset, IngestedSiteData } from '../types/helios';

interface ConfigurationFormProps {
  formData: CompanyInput;
  onChange: (data: CompanyInput) => void;
  onSubmit: () => void;
  isRunning: boolean;
  ingestedData: IngestedSiteData | null;
  onIngestSuccess: (data: IngestedSiteData) => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isRunning,
  ingestedData,
  onIngestSuccess,
}) => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);

  const handleAddSampleAsset = (type: UploadedAsset['type'], name: string, notes: string) => {
    const newAsset: UploadedAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      type,
      notes,
    };
    onChange({
      ...formData,
      uploadedAssets: [...formData.uploadedAssets, newAsset],
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');

      reader.onload = () => {
        const result = reader.result as string;
        const newAsset: UploadedAsset = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type: isImg ? 'image' : 'spreadsheet',
          notes: `Uploaded file (${(file.size / 1024).toFixed(1)} KB)`,
          previewUrl: isImg ? result : undefined,
          base64: isImg ? result : undefined,
          mimeType: file.type || 'application/octet-stream',
        };
        onChange({
          ...formData,
          uploadedAssets: [...formData.uploadedAssets, newAsset],
        });
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const handleRemoveAsset = (id: string) => {
    onChange({
      ...formData,
      uploadedAssets: formData.uploadedAssets.filter((a) => a.id !== id),
    });
  };

  const handleAssetNotesChange = (id: string, notes: string) => {
    onChange({
      ...formData,
      uploadedAssets: formData.uploadedAssets.map((a) =>
        a.id === id ? { ...a, notes } : a
      ),
    });
  };

  const handleIngestWebsite = async () => {
    if (!formData.websiteUrl) {
      setIngestError('Please enter a website URL first.');
      return;
    }

    setIsIngesting(true);
    setIngestError(null);

    try {
      const resp = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.websiteUrl }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to ingest website');
      }

      onIngestSuccess(data);
    } catch (err: any) {
      setIngestError(err.message || 'Could not fetch site info.');
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header with simple text */}
      <div className="mb-6 text-center">
        <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-widest block mb-1">
          Helios Decision Engine
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
          Tell us about your business
        </h2>
        <p className="text-sm text-neutral-600 mt-1 max-w-lg mx-auto">
          Helios uses 8 specialized AI agents and a 5-member consultant board to analyze your market, test your numbers, and recommend your best next moves.
        </p>

        {/* Quick Demo Pre-fill (Generic Templates) */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono">
          <span className="text-neutral-400">Quick Fill:</span>
          <button
            type="button"
            onClick={() => {
              onChange({
                companyName: 'AeroSynth Edge',
                industry: 'Cloud Software & AI Tools',
                websiteUrl: 'https://sentur.org',
                employees: 12,
                businessSummary:
                  'We make web apps load instantly at the edge, cutting server hosting bills and speeding up response times.',
                currentRevenue: '$85,000 / month',
                monthlyUsers: '45,000 users',
                followerCount: '12,500 followers',
                goalMetric: 'Reach $350,000 / month and 80,000 users in 12 months',
                additionalContext:
                  'Acquisition cost is $340 per user. Lots of people drop off on the pricing page. We need to decide whether to push self-serve or hire sales.',
                uploadedAssets: [
                  {
                    id: 's1',
                    name: 'Best Ad: "Load Apps in Under 10ms"',
                    type: 'social_post',
                    notes: 'High performer: 4.8% click rate, high signups.',
                  },
                  {
                    id: 's2',
                    name: 'Worst Ad: "Complex Architecture Chart"',
                    type: 'social_post',
                    notes: 'Low performer: confusing technical words, 0.4% click rate.',
                  },
                ],
              });
            }}
            className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors border border-neutral-200"
          >
            Example: Tech SaaS
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({
                companyName: 'Verve Botanicals',
                industry: 'Organic Health & Supplements',
                websiteUrl: 'https://verve-botanicals.store',
                employees: 5,
                businessSummary:
                  'Eco-friendly mushroom and herbal health powders delivered straight to subscribers in compostable jars.',
                currentRevenue: '$40,000 / month',
                monthlyUsers: '22,000 users',
                followerCount: '38,000 followers',
                goalMetric: 'Reach $120,000 / month and 8,000 subscribers in 9 months',
                additionalContext:
                  'Instagram ad costs have gone up. Customers like the product, but repeat orders drop after month 2.',
                uploadedAssets: [
                  {
                    id: 'v1',
                    name: 'Best Post: "How We Harvest Clean Herbs"',
                    type: 'social_post',
                    notes: 'Gained 280 orders from one viral video.',
                  },
                  {
                    id: 'v2',
                    name: 'Worst Post: "Generic 10% Off Coupon"',
                    type: 'social_post',
                    notes: 'Hardly any engagement.',
                  },
                ],
              });
            }}
            className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors border border-neutral-200"
          >
            Example: E-Commerce
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="border border-neutral-200 bg-white p-6 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => onChange({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Acme Studio"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Industry or Field *
            </label>
            <input
              type="text"
              required
              value={formData.industry}
              onChange={(e) => onChange({ ...formData, industry: e.target.value })}
              placeholder="e.g. Software, Clothing, Consulting"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Website + Live Scrape */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-800">
                Website URL (we will read your site) *
              </label>
              {ingestedData && (
                <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Site content loaded
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => onChange({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleIngestWebsite}
                disabled={isIngesting || !formData.websiteUrl}
                className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isIngesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                    <span>Reading site...</span>
                  </>
                ) : (
                  <span>Fetch Site Info</span>
                )}
              </button>
            </div>

            {ingestError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {ingestError}
              </p>
            )}

            {ingestedData && (
              <div className="mt-2 p-2.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-mono">
                <span className="font-semibold text-neutral-900 block truncate">
                  {ingestedData.title}
                </span>
                <span className="text-neutral-500 line-clamp-1 mt-0.5">
                  {ingestedData.summaryExcerpt}
                </span>
              </div>
            )}
          </div>

          {/* Number of Employees */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Number of Employees *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.employees}
              onChange={(e) =>
                onChange({ ...formData, employees: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Current Revenue */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Current Revenue *
            </label>
            <input
              type="text"
              required
              value={formData.currentRevenue}
              onChange={(e) => onChange({ ...formData, currentRevenue: e.target.value })}
              placeholder="e.g. $45,000 / month"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Monthly Active Users / Traffic Estimate */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Monthly Users / Traffic Estimate *
            </label>
            <input
              type="text"
              required
              value={formData.monthlyUsers}
              onChange={(e) => onChange({ ...formData, monthlyUsers: e.target.value })}
              placeholder="e.g. 15,000 monthly visitors"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Social Media Follower Count */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Social Media Follower Count *
            </label>
            <input
              type="text"
              required
              value={formData.followerCount}
              onChange={(e) => onChange({ ...formData, followerCount: e.target.value })}
              placeholder="e.g. 8,500 followers across channels"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Goal */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Your Goal (Monthly Users or Revenue) *
            </label>
            <input
              type="text"
              required
              value={formData.goalMetric}
              onChange={(e) => onChange({ ...formData, goalMetric: e.target.value })}
              placeholder="e.g. Reach $150,000 / month and 15,000 users in 12 months"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Brief Summary */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Brief Summary: What does your business do? *
            </label>
            <textarea
              required
              rows={2}
              value={formData.businessSummary}
              onChange={(e) => onChange({ ...formData, businessSummary: e.target.value })}
              placeholder="Explain how you help customers and make money..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Extra Context */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Any other details or bottlenecks you are facing? (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.additionalContext}
              onChange={(e) => onChange({ ...formData, additionalContext: e.target.value })}
              placeholder="e.g. Marketing costs are high, sales cycle takes 2 months, team is stretched thin..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 focus:border-orange-600 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Uploads Section */}
        <div className="pt-3 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
            <label className="text-xs font-semibold text-neutral-800">
              Helpful Uploads & Context (Images, Spreadsheets, Site Data)
            </label>
          </div>

          {/* Upload input */}
          <label className="border border-dashed border-neutral-300 hover:border-orange-500 bg-neutral-50/50 hover:bg-white p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-neutral-600">
            <Upload className="w-4 h-4 text-neutral-400" />
            <span>Click to upload images, screenshots, or spreadsheets</span>
            <input
              type="file"
              multiple
              accept="image/*,.csv,.xlsx,.xls,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Uploaded items list */}
          {formData.uploadedAssets.length > 0 && (
            <div className="mt-2.5 space-y-1.5">
              {formData.uploadedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-2 border border-neutral-200 bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {asset.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-orange-600 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-neutral-600 shrink-0" />
                    )}
                    <span className="font-semibold text-neutral-900 truncate">
                      {asset.name}
                    </span>
                    <input
                      type="text"
                      value={asset.notes || ''}
                      onChange={(e) => handleAssetNotesChange(asset.id, e.target.value)}
                      placeholder="Add brief note about this..."
                      className="text-xs px-2 py-0.5 border border-neutral-200 bg-neutral-50 w-44 sm:w-64"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="text-neutral-400 hover:text-red-600 p-1 shrink-0"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isRunning}
            className={`w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 ${
              isRunning
                ? 'bg-neutral-800 opacity-80 cursor-wait'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-98 shadow-sm'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Agents...</span>
              </>
            ) : (
              <>
                <span>Run Helios Decision Engine</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

'use client';

export function SettingsPopup() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="font-bold mb-4">Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Language</label>
          <select className="w-full p-2 border rounded">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}

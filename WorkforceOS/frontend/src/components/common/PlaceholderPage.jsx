import { Construction } from 'lucide-react';
import Card from '../ui/Card';

const PlaceholderPage = ({ title, description, implementationNotes }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="text-center py-12">
          <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          
          {implementationNotes && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-3">Implementation Notes:</h3>
              <div className="text-sm text-blue-800 space-y-2">
                {implementationNotes.map((note, index) => (
                  <p key={index}>• {note}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage;

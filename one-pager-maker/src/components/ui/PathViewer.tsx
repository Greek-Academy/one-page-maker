import { Link } from "react-router-dom";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface PathViewerProps {
  path?: string;
  filename?: string;
  uid: string;
}

export function PathViewer({ path, filename, uid }: PathViewerProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!path) return null;

  const pathParts = path.split('/').filter(Boolean);
  
  return (
    <div className={`flex transition-all duration-300 ${isOpen ? 'w-64' : 'w-8'}`}>
      <div className="relative flex h-full flex-col border-r bg-gray-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-2 flex h-8 w-4 items-center justify-center rounded-r bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          {isOpen ? <IoChevronBackOutline /> : <IoChevronForwardOutline />}
        </button>
        
        {isOpen && (
          <div className="p-4">
            <h3 className="mb-4 font-semibold">Document Path</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">
                root
              </Link>
              {pathParts.map((part, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-1">└</span>
                  <Link 
                    to={`/${uid}/${pathParts.slice(0, index + 1).join('/')}`}
                    className="hover:text-blue-600"
                  >
                    {part}
                  </Link>
                </div>
              ))}
              {filename && (
                <div className="flex items-center">
                  <span className="mr-1">└</span>
                  <span className="text-gray-800">{filename}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

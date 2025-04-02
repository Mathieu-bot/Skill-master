import React from 'react';
import assets from '../../assets/assets';

const AnalysisCard = () => {
    return (
        <div className='absolute w-[95%] left-[2.5%] bottom-3 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm shadow-lg'>
            <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                    {assets.graduationIconDark}
                </div>
                <div>
                    <h3 className="font-medium dark:text-white">Analyse de geste technique</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Feedback en temps réel</p>
                </div>
            </div>
            <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 dark:bg-gray-500 w-[85%] rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
                <span>Précision du geste</span>
                <span className="font-medium">85%</span>
            </div>
        </div>
    );
};

export default AnalysisCard;

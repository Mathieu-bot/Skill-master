import React from 'react';

const LearnersBadge = ({ count }) => (
    <div className="h-8 w-8 rounded-full border-2 border-gray-800 dark:border-gray-200 bg-gray-800 dark:bg-gray-200 flex items-center justify-center text-xs font-medium text-white dark:text-gray-800">
        +{count}K
    </div>
);

const LearnersBadges = () => {
    return (
        <div className="mt-4 md:mt-6 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex -space-x-2">
                <LearnersBadge count={1} />
                <LearnersBadge count={5} />
                <LearnersBadge count={10} />
            </div>
            <div>Plus de 10 000 apprenants certifiés</div>
        </div>
    );
};

export default LearnersBadges;

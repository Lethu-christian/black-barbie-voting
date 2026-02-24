import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ContestantCard({ contestant, rank }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative"
        >
            <Link to={`/contestant/${contestant.id}`}>
                <div className="relative h-96 overflow-hidden">
                    {rank && (
                        <div className="absolute top-4 right-4 z-10 w-10 h-10 bg-yellow-400 text-brand-900 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
                            #{rank}
                        </div>
                    )}
                    <img
                        src={contestant.image_url}
                        alt={contestant.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium">Vote Now &rarr;</span>
                    </div>
                </div>

                <div className="p-5 bg-brand-50">
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                        {contestant.name}
                    </h3>
                    <p className="text-sm text-brand-600 font-medium mb-2">Contestant #{contestant.number}</p>
                    <div className="flex justify-between items-center border-t border-brand-100 pt-3">
                        <span className="text-2xl font-bold text-brand-600">{contestant.votes}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Votes</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

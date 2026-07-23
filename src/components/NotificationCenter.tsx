import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MessageSquare, Calendar, Star, Info } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationCenterProps {
  notification: PushNotification | null;
  onClose: () => void;
  onTap: () => void;
}

export default function NotificationCenter() {
  return null;
}


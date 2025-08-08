import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserName } from '../user/UserName';
import { EventName } from '../events/EventName';
import { ActivityItem } from '../../types/activity';

interface ActivityContentProps {
  activity: ActivityItem;
}

export const ActivityContent: React.FC<ActivityContentProps> = ({ activity }) => {
  const { user: currentUser } = useAuth();

  const renderActivityContent = (activity: ActivityItem) => {
    console.log('Processing activity:', activity);
    
    let content = activity.template_text;
    console.log('Original template:', content);
    
    // Replace user_name with a placeholder that we'll replace with the UserName component
    content = content.replace('{user_name}', '__USER_NAME_PLACEHOLDER__');
    
    if (activity.followed_user_id) {
      content = content.replace('{followed_user_name}', '__FOLLOWED_USER_NAME_PLACEHOLDER__');
    }
    
    if (activity.event_title) {
      // Create event link if we have reference_id_1 (event ID)
      content = content.replace('{event_name}', '__EVENT_NAME_PLACEHOLDER__');
      console.log('After event_name replacement:', content);
    }
    
    if (activity.event_date) {
      const eventDate = new Date(activity.event_date);
      const formattedDate = `${eventDate.getFullYear()}/${String(eventDate.getMonth() + 1).padStart(2, '0')}/${String(eventDate.getDate()).padStart(2, '0')}`;
      content = content.replace('{event_date}', formattedDate);
      console.log('After event_date replacement:', content);
    }
    
    if (activity.review_rating) {
      content = content.replace('{review_rating}', activity.review_rating.toString());
      console.log('After review_rating replacement:', content);
    }
    
    if (activity.ticket_type_name) {
      content = content.replace('{ticket_type_name}', activity.ticket_type_name);
      console.log('After ticket_type_name replacement:', content);
    }
    
    if (activity.ticket_quantity) {
      content = content.replace('{ticket_quantity}', activity.ticket_quantity.toString());
      console.log('After ticket_quantity replacement:', content);
      
      // Handle plural logic for ticket_quantity
      const pluralRegex = /\{ticket_quantity\|plural:([^}]+)\}/g;
      content = content.replace(pluralRegex, (_, pluralSuffix) => {
        return activity.ticket_quantity! > 1 ? pluralSuffix : '';
      });
      console.log('After plural replacement:', content);
    }
    
    if (activity.metadata?.name) {
      content = content.replace('{achievement_name}', activity.metadata.name);
      console.log('After achievement_name replacement:', content);
    }

    console.log('Final rendered content:', content);
    return content;
  };

  const renderActivityWithUserNames = (activity: ActivityItem) => {
    const content = renderActivityContent(activity);
    
    // Split content by placeholders and render with appropriate components
    const result: React.ReactNode[] = [];
    const parts = content.split(/(__USER_NAME_PLACEHOLDER__|__FOLLOWED_USER_NAME_PLACEHOLDER__|__EVENT_NAME_PLACEHOLDER__)/);
    
    parts.forEach((part, index) => {
      if (part === '__USER_NAME_PLACEHOLDER__') {
        result.push(
          <UserName 
            key={`user-${activity.user_id}-${index}`}
            userId={activity.user_id} 
            showFollowButton={true} 
            showIcon={false}
            className="inline-block"
          />
        );
      } else if (part === '__FOLLOWED_USER_NAME_PLACEHOLDER__' && activity.followed_user_id) {
        // Check if the followed user is the current logged-in user
        if (currentUser && activity.followed_user_id === currentUser.id) {
          result.push(
            <span key={`you-${index}`} className="font-medium text-[#1E30FF]">you</span>
          );
        } else {
          result.push(
            <UserName 
              key={`followed-${activity.followed_user_id}-${index}`}
              userId={activity.followed_user_id} 
              showFollowButton={true} 
              showIcon={false}
              className="inline-block"
            />
          );
        }
      } else if (part === '__EVENT_NAME_PLACEHOLDER__' && activity.event_title && activity.reference_id_1) {
        result.push(
          <EventName 
            key={`event-${activity.reference_id_1}-${index}`}
            eventId={activity.reference_id_1}
            eventTitle={activity.event_title}
            className="inline-block"
          />
        );
      } else if (part && part.trim()) {
        result.push(<span key={`text-${index}`}>{part}</span>);
      }
    });
    
    return <span className="inline">{result}</span>;
  };

  return renderActivityWithUserNames(activity);
};

import React from 'react';
import { TrendingUp, Calendar, Star, Users, MessageCircle, Trophy, Heart, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivity } from '../contexts/useActivity';
import { UserName } from '../components/user/UserName';

export const Latest: React.FC = () => {
  const { activities, loading, error } = useActivity();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'event_created':
        return <Calendar className="w-5 h-5 text-[#1E30FF]" />;
      case 'user_followed':
        return <Users className="w-5 h-5 text-[#489707]" />;
      case 'event_reviewed':
        return <Star className="w-5 h-5 text-[#f0900a]" />;
      case 'ticket_purchased':
        return <MessageCircle className="w-5 h-5 text-[#FF2D95]" />;
      case 'achievement_unlocked':
        return <Trophy className="w-5 h-5 text-[#489707]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'event_created':
        return 'from-[#1E30FF]/10 to-[#FF2D95]/10 border-[#1E30FF]/20';
      case 'user_followed':
        return 'from-[#489707]/10 to-[#1E30FF]/10 border-[#489707]/20';
      case 'event_reviewed':
        return 'from-[#f0900a]/10 to-[#FF2D95]/10 border-[#f0900a]/20';
      case 'ticket_purchased':
        return 'from-[#FF2D95]/10 to-[#f0900a]/10 border-[#FF2D95]/20';
      case 'achievement_unlocked':
        return 'from-[#489707]/10 to-[#1E30FF]/10 border-[#489707]/20';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const renderActivityContent = (activity: any) => {
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
      const eventId = activity.reference_id_1;
      if (eventId) {
        const eventLink = `<span class="text-[#1E30FF] hover:text-[#FF2D95] font-medium underline transition-colors duration-200 cursor-pointer" data-event-id="${eventId}">${activity.event_title}</span>`;
        content = content.replace('{event_name}', eventLink);
      } else {
        content = content.replace('{event_name}', activity.event_title);
      }
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
      content = content.replace(pluralRegex, (match, pluralSuffix) => {
        return activity.ticket_quantity > 1 ? pluralSuffix : '';
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

  const renderActivityWithUserNames = (activity: any) => {
    const content = renderActivityContent(activity);
    
    // Split content by user name placeholders and render with UserName components
    let result: React.ReactNode[] = [];
    let remainingContent = content;
    
    // Handle user_name placeholder
    if (remainingContent.includes('__USER_NAME_PLACEHOLDER__')) {
      const parts = remainingContent.split('__USER_NAME_PLACEHOLDER__');
      result.push(parts[0]);
      result.push(
        <UserName 
          key={`user-${activity.user_id}`}
          userId={activity.user_id} 
          showFollowButton={false} 
          showIcon={false}
          className="inline-block"
        />
      );
      remainingContent = parts[1];
    }
    
    // Handle followed_user_name placeholder
    if (remainingContent.includes('__FOLLOWED_USER_NAME_PLACEHOLDER__') && activity.followed_user_id) {
      const parts = remainingContent.split('__FOLLOWED_USER_NAME_PLACEHOLDER__');
      result.push(parts[0]);
      result.push(
        <UserName 
          key={`followed-${activity.followed_user_id}`}
          userId={activity.followed_user_id} 
          showFollowButton={false} 
          showIcon={false}
          className="inline-block"
        />
      );
      remainingContent = parts[1];
    }
    
    // Add any remaining content
    if (remainingContent) {
      result.push(<span key="remaining" dangerouslySetInnerHTML={{ __html: remainingContent }} onClick={handleEventClick} />);
    }
    
    // If no placeholders were found, return the original content
    if (result.length === 0) {
      return <span dangerouslySetInnerHTML={{ __html: content }} onClick={handleEventClick} />;
    }
    
    return <span className="inline-flex items-center flex-wrap">{result}</span>;
  };
  const handleEventClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const eventId = target.getAttribute('data-event-id');
    if (eventId) {
      e.preventDefault();
      navigate(`/event/${eventId}`);
    }
  };

  const renderReactions = (activity: any) => {
    if (activity.total_reactions === 0) return null;

    return (
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4" />
          <span>{activity.total_reactions} reactions</span>
        </div>
        {activity.total_comments > 0 && (
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{activity.total_comments} comments</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
          <span className="text-gray-600">Loading latest activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Latest Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay up to date with what's happening in your community
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">Error loading activities</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Activities Feed */}
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`bg-gradient-to-r ${getActivityColor(activity.activity_type)} rounded-xl border p-6 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium leading-relaxed">
                          {renderActivityWithUserNames(activity)}
                        </div>
                        
                        {/* Additional Details */}
                        {activity.review_snippet && (
                          <div className="mt-3 bg-white/60 rounded-lg p-3 border border-white/40">
                            <div className="flex items-center space-x-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (activity.review_rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 text-sm italic">"{activity.review_snippet}"</p>
                          </div>
                        )}

                        {/* Reactions and Comments */}
                        <div className="mt-3 flex items-center justify-between">
                          {renderReactions(activity)}
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-600 mb-6">
              Start engaging with events and other users to see activities here
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

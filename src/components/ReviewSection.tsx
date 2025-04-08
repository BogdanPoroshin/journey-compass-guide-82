
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  StarHalf,
  Calendar,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { addReview } from "@/api/supabaseApi";

interface ReviewProps {
  id: string;
  rating: number;
  comment: string;
  visitedDate: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profileImage?: string;
  };
  isCurrentUserReview?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

interface ReviewSectionProps {
  routeId: string;
  reviews: ReviewProps[];
  averageRating: number;
  totalReviews: number;
  hasUserReviewed: boolean;
  onAddReview?: () => void;
  onLoadMore?: () => void;
  hasMoreReviews?: boolean;
  className?: string;
}

const ReviewSection = ({
  routeId,
  reviews,
  averageRating,
  totalReviews,
  hasUserReviewed,
  onAddReview,
  onLoadMore,
  hasMoreReviews = false,
  className = "",
}: ReviewSectionProps) => {
  const { user } = useUser();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isAddingReview, setIsAddingReview] = useState(false);

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleMouseEnter = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      alert("Пожалуйста, выберите рейтинг!");
      return;
    }

    if (!user) {
      alert("Необходимо войти в систему!");
      return;
    }

    const result = await addReview(routeId, user.id, userRating, userComment, visitedDate);
    
    if (result) {
      setUserRating(0);
      setUserComment("");
      setVisitedDate("");
      setIsAddingReview(false);
      
      if (onAddReview) {
        onAddReview();
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 fill-travel-accent text-travel-accent"
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="h-4 w-4 fill-travel-accent text-travel-accent"
          />
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }

    return stars;
  };

  const renderUserRatingInput = () => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            className="focus:outline-none mx-0.5"
          >
            <Star
              className={`h-8 w-8 ${
                rating <= (hoverRating || userRating)
                  ? "fill-travel-accent text-travel-accent"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Отзывы</span>
              <div className="flex items-center">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="ml-2 text-sm font-normal">
                  {averageRating.toFixed(1)} ({totalReviews})
                </span>
              </div>
            </div>

            {user && !hasUserReviewed && !isAddingReview && (
              <Button 
                onClick={() => setIsAddingReview(true)}
                className="bg-travel-primary hover:bg-travel-primary/90"
              >
                Добавить отзыв
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAddingReview && (
            <Card className="mb-6 border-travel-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Напишите отзыв</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renderUserRatingInput()}

                  <div>
                    <label htmlFor="visited-date" className="block text-sm font-medium mb-1">
                      Когда вы посетили это место?
                    </label>
                    <input
                      type="date"
                      id="visited-date"
                      value={visitedDate}
                      onChange={(e) => setVisitedDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-travel-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium mb-1">
                      Ваш отзыв
                    </label>
                    <Textarea
                      id="review-comment"
                      placeholder="Поделитесь своими впечатлениями..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingReview(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleSubmitReview} className="bg-travel-primary hover:bg-travel-primary/90">
                  Отправить отзыв
                </Button>
              </CardFooter>
            </Card>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Отзывов пока нет. Будьте первым, кто оставит отзыв!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={review.user.profileImage}
                          alt={review.user.username}
                        />
                        <AvatarFallback className="bg-travel-secondary text-white">
                          {review.user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.user.username}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.isCurrentUserReview && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => review.onEdit && review.onEdit(review.id)}
                          className="h-7 w-7"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => review.onDelete && review.onDelete(review.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {review.visitedDate && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Посещено {new Date(review.visitedDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="mt-2 text-sm">{review.comment}</div>
                </div>
              ))}
            </div>
          )}

          {hasMoreReviews && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={onLoadMore} className="flex items-center gap-1">
                Показать больше отзывов
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;

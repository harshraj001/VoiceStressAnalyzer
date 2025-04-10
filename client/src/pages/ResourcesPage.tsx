import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Video, Music } from 'lucide-react';

export default function ResourcesPage() {
  // Resource categories with links
  const resources = [
    {
      title: "Understanding Stress",
      icon: <BookOpen className="h-10 w-10 text-primary/80" />,
      items: [
        { title: "What is Stress?", type: "Article", link: "https://www.apa.org/topics/stress" },
        { title: "The Science of Stress", type: "Video", link: "https://www.youtube.com/watch?v=vzrjEP5MOT4" },
        { title: "Physical Effects of Chronic Stress", type: "Article", link: "https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response" },
        { title: "How Stress Affects Your Brain", type: "Video", link: "https://www.youtube.com/watch?v=WuyPuH9ojCE" }
      ]
    },
    {
      title: "Stress Relief Techniques",
      icon: <Music className="h-10 w-10 text-primary/80" />,
      items: [
        { title: "Guided Breathing Exercises", type: "Audio", link: "https://www.calm.com/breathe" },
        { title: "Progressive Muscle Relaxation", type: "Audio", link: "https://www.youtube.com/watch?v=86HUcjsT3WI" },
        { title: "5-Minute Meditation for Busy People", type: "Audio", link: "https://www.youtube.com/watch?v=inpok4MKVLM" },
        { title: "Nature Sounds for Stress Relief", type: "Audio", link: "https://www.youtube.com/watch?v=eKFTSSKCzWA" }
      ]
    },
    {
      title: "Building Resilience",
      icon: <FileText className="h-10 w-10 text-primary/80" />,
      items: [
        { title: "Developing a Resilient Mindset", type: "Article", link: "https://www.mindtools.com/pages/article/resilience.htm" },
        { title: "Cognitive Restructuring Techniques", type: "Worksheet", link: "https://positivepsychology.com/cognitive-restructuring/" },
        { title: "Building Better Stress Coping Skills", type: "Guide", link: "https://www.helpguide.org/articles/stress/stress-management.htm" },
        { title: "Emotional Regulation Strategies", type: "Article", link: "https://www.verywellmind.com/emotion-regulation-skills-training-425374" }
      ]
    },
    {
      title: "Expert Talks",
      icon: <Video className="h-10 w-10 text-primary/80" />,
      items: [
        { title: "The Upside of Stress - Dr. Kelly McGonigal", type: "Video", link: "https://www.youtube.com/watch?v=RcGyVTAoXEU" },
        { title: "Managing Work-Related Stress", type: "Video", link: "https://www.youtube.com/watch?v=hnpQrMqDoqE" },
        { title: "Stress and Sleep: Breaking the Cycle", type: "Video", link: "https://www.youtube.com/watch?v=wYPadm4OoSg" },
        { title: "Mindfulness for Everyday Life", type: "Video", link: "https://www.youtube.com/watch?v=qzR62JJCMBQ" }
      ]
    }
  ];

  // Get icon based on resource type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Article':
        return <FileText className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Audio':
        return <Music className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative z-0 flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto w-full px-4 py-6 md:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Stress Management Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((category, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      {category.icon}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <ul className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-3"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                  {getTypeIcon(item.type)}
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.type}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

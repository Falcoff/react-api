<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Security;

class InvoiceChrono implements EventSubscriberInterface
{

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository){
        $this->security = $security;
        $this->repository=$repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>['setChrono', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChrono(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($result instanceof Invoice && $method ==="POST"){
            $user = $this->security->getUser();
            $num = $this->repository->findNextChrono($user);
            $result->setChrono($num);
            if(empty($result->getSentAt())){
                $result->setSentAt(new \DateTime());
            }
        }
    }
}
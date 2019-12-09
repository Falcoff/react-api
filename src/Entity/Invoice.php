<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;


use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"={"groups"={"invoices_subresource"}}
 *  }
 * },
 *  attributes={
 *      "pagination_enabled"=true,
 *      "pagination_items_per_page"=20,
 *      "order":{"amount":"desc"}
 *  },
 *  normalizationContext={"groups"={"invoices_read"}},
 *  denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount","sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read","invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read","invoices_subresource"})
     * @Assert\Type(type="numeric", message="le montant de la facture doit être numerique")
     * @Assert\NotBlank(message= "Le montant ne peut être vide")
     */
    private $amount;


    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="La date d'envoi doit être renseignée")   
     */
    private $sentAt;

    
    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le statut doit être renseigné")
     * @Assert\Choice(choices={"PAID", "SENT","CANCELLED"}, message="le statut doit être cancelled, paid ou sent")

     */
    private $status;

    
    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le customer doit être renseigné")

     */
    private $customer;



    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="il faut un chrono")
     * @Assert\Type(type="integer", message="le chrono doit être un int")
     */
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }
    /**
     * retourne le user
     * @Groups({"invoices_read","invoices_subresource"})
     * @return User
     */
    public function getUser() : ?User {
        return $this->customer->getUser();
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}

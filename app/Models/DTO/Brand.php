<?php

namespace App\Models\DTO;


class Brand 
{
  public function __construct(App\Models\Entities\Brand $entity) {
      $dto = new Brand();
      $dto->name = $entity->name;
      $dto->description = $entity->description;
      $dto->note = $entity->note;
      $dto->enabled = $entity->deleted_at == null ? true : false;   
  }
}

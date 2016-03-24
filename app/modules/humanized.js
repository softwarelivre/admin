(function() {
  "use strict";

  angular
    .module("segue.admin.humanized", [ 'segue.admin' ])
    .constant("HumanizedStrings", {
       'business':          'corporativo',
       'caravan':           'caravanista',
       'caravan-leader':    'líder de caravana',
       'foreigner':         'estrangeiro',
       'foreigner-student': 'estrangeiro estudante',
       'government':        'empenho',
       'normal':            'individual',
       'promocode':         'código promocional',
       'proponent':         'proponente',
       'proponent-student': 'proponente estudante',
       'speaker':           'palestrante',
       'student':           'Estudante',

        // disability types
        'none':     'Não',
        'physical': 'Física',
        'hearing':  'Auditiva',
        'visual':   'Visual',
        'mental':   'Mental',

        // status
        'paid': 'Pago',
        'pending': 'Pendente',

        // ocupation types
        //'student': 'Estudante',
        'private_employee': 'Funcionário',
        'public_employee': 'Funcionário Público',
        'businessman': 'Empresário',
        'freelancer': 'Autônomo',

        // education
        'post_graduation_stricto': 'Mestrado/Doutorado',
        'post_graduation_lato': 'Pós Graduação/Especialização',
        'graduation': 'Ensino Superior Completo',
        'graduation_incomplete': 'Ensino Superior Incompleto',
        'secondary': 'Ensino Médio Completo',
        'secondary_incomplete': 'Ensino Médio Incompleto',

        // proposal types
        'workshop': 'oficina',
        'talk': 'palestra'

    });
})();
